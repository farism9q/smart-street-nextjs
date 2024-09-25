import { getEmbedding } from "@/actions/openai";
import { searchEmbedding } from "@/actions/pinecone";
import {
  getAllViolation,
  getViolationsStats,
  getAllViolationsInRange,
} from "@/actions/violation";
import { Metadata } from "@/types/pinecone-record";
import { CurrentDate } from "@/types/violation";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, CoreMessage, tool } from "ai";
import { formatDate, parseISO } from "date-fns";
import { z } from "zod";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

function prepareQuestionToGPT(query: string, metadata: Metadata[]) {
  const infos = metadata
    .map(
      data =>
        `
          day: ${data.day}
          is weekend: ${data.isWeekend}
          latitude: ${data.latitude}
          longitude: ${data.longitude}
          month: ${data.month}
          street name: ${data.street_name}
          time: ${data.time}
          vehicle type: ${data.vehicle_type}
          violation type: ${data.violation_type}
        `
    )
    .join("\n");

  return `
  Query: ${query}

  Answer based on below information: ${infos}
  `;
}

async function getRelevantInformation(query: string) {
  const embeddings = await getEmbedding(query);

  const { matches } = await searchEmbedding(embeddings);

  const metadata = matches
    .map(data => data.metadata)
    .filter(Boolean) as Metadata[];

  return prepareQuestionToGPT(query, metadata);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const filteredMessages = messages.filter(
      (message: CoreMessage) => message.content !== ""
    );

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [...convertToCoreMessages(filteredMessages)],
      system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
      maxSteps: 4,
      tools: {
        getViolationsStats: tool({
          description:
            "Retrieve the statistics of the violations recorded based on the current date. If the current date is a year, it will return the total number of violations recorded in current year. The same applies to the month and day. Include all values if there more than one valeu",
          parameters: z.object({
            current: z.enum(["year", "month", "day"]),
          }),
          execute: ({ current }: { current: "year" | "month" | "day" }) =>
            getViolationsStats({
              current: current as CurrentDate,
            }),
        }),

        getCurrentDate: tool({
          description: "Use this tool to get the current date.",
          parameters: z.object({}),
          execute: async () =>
            Promise.resolve(formatDate(new Date(), "yyyy-MM-dd")),
        }),

        getAllViolationsInRange: tool({
          description:
            "Retrieve all violations recorded in the specified range of dates. If no range is specified, act as you are in 2024.",
          parameters: z.object({
            from: z.string(),
            to: z.string(),
          }),
          execute: ({ from, to }) => {
            return getAllViolationsInRange({
              from: parseISO(from),
              to: parseISO(to),
            });
          },
        }),
        getAllViolations: tool({
          description:
            "Retrieve all violations recorded to answer the question.",
          parameters: z.object({}),
          execute: () => getAllViolation(),
        }),
      },
    });

    for await (const part of result.fullStream) {
      switch (part.type) {
        case "error": {
          const error = part.error;

          if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
          }

          break;
        }
      }
    }

    return result.toDataStreamResponse();
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
