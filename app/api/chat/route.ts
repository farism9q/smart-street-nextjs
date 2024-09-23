import { getEmbedding } from "@/actions/openai";
import { searchEmbedding } from "@/actions/pinecone";
import {
  getAllViolation,
  getViolationsStats,
  getViolationByDate,
} from "@/actions/violation";
import { Metadata } from "@/types/pinecone-record";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, CoreMessage, tool } from "ai";
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
            "Retrieve statistics about violations, including types of violations, associated vehicle types, and the streets where these violations occurred.",
          parameters: z.object({}),
          execute: () => getViolationsStats(),
        }),
        getStatistics: tool({
          description:
            "Get statisticts about the violations, including the number of violations recorded per day, month, and year.",
          parameters: z.object({
            year: z.boolean().optional(),
            month: z.boolean().optional(),
            day: z.boolean().optional(),
          }),
          execute: () =>
            getViolationByDate({
              year: true,
              month: true,
              day: true,
            }),
        }),
        // getEmbedding: tool({
        //   description:
        //     "Obtain the embeddings for the query to be used for searching relevant information.",
        //   parameters: z.object({ query: z.string() }),
        //   execute: ({ query }) => getEmbedding(query),
        // }),
        // findRelevantInformation: tool({
        //   description:
        //     "Identify and retrieve relevant information based on the provided query.",
        //   parameters: z.object({ query: z.string() }),
        //   execute: ({ query }) => getRelevantInformation(query),
        // }),
        getAllViolations: tool({
          description: "Retrieve all violations recorded.",
          parameters: z.object({}),
          execute: () => getAllViolation(),
        }),
      },
    });

    console.log("RESPONSE STREAM", result);

    for await (const part of result.fullStream) {
      console.log("PART", part);

      switch (part.type) {
        case "error": {
          const error = part.error;

          console.log("ERROR", error);

          if (error instanceof Error) {
            return new Response(error.message, { status: 500 });
          }

          break;
        }
      }
    }

    return result.toDataStreamResponse();
  } catch (error) {
    console.log("RESPONSE STREAM ERROR", error);
    return new Response("Internal server error", { status: 500 });
  }
}
