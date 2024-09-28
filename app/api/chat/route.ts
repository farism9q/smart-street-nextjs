import { getEmbedding } from "@/actions/openai";
import { searchEmbedding } from "@/actions/pinecone";
import {
  getAllViolation,
  getViolationsStats,
  getAllViolationsInRange,
  getTotalViolationsBasedOnYear,
  getSummaryOfCurrentYear,
  getHighestViolationsYearMonthDay,
} from "@/actions/violation";
import { Metadata } from "@/types/pinecone-record";
import { CurrentDate } from "@/types/violation";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  convertToCoreMessages,
  CoreMessage,
  tool,
  generateText,
} from "ai";
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

    const userQuery = filteredMessages[filteredMessages.length - 1].content;

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [...convertToCoreMessages(filteredMessages)],
      system: `You are a helpful assistant. Use the provided tools to answer the user's questions.
      Here is the user's question: ${userQuery}.
      If the information cannot be found in the tools, respond with "Sorry, I don't know."`,
      maxSteps: 5,
      tools: {
        getViolationsStats: tool({
          description:
            "Retrieve the statistics of the violations recorded based on the current date. If the current date is a year, it will return the total number of violations recorded in current year. The same applies to the month, week, and day. Include all values if there more than one valeu",
          parameters: z.object({
            current: z.enum([
              CurrentDate.day,
              CurrentDate.week,
              CurrentDate.month,
              CurrentDate.year,
            ]),
          }),
          execute: ({ current }) =>
            getViolationsStats({
              current,
            }),
        }),

        getHighestViolationsYearMonthDay: tool({
          description: `Retrieve the time period (year, month, or day) with the highest number of recorded violations.
          This tool will return the year, month, and day with the highest number of violations.`,
          parameters: z.object({}),
          execute: () => getHighestViolationsYearMonthDay(),
        }),
        getTotalViolationsBasedOnYear: tool({
          description:
            "Get the total number of violations recorded in the specified year.",
          parameters: z.object({
            year: z.number(),
          }),
          execute: ({ year }) => getTotalViolationsBasedOnYear(year),
        }),

        getSummaryOfCurrentYear: tool({
          description:
            "Get the total number of violations recorded in the current year, highest number of violations based on street, vehicle, violation type, and the day.",
          parameters: z.object({}),
          execute: () => getSummaryOfCurrentYear(),
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
