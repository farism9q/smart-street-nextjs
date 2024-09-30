import {
  getAllViolation,
  getViolationsStats,
  getTotalViolationsBasedOnYear,
  getSummaryOfCurrentYear,
  getAllViolationsInRange,
} from "@/actions/violation";
import { CurrentDate } from "@/types/violation";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, CoreMessage, tool } from "ai";
import { z } from "zod";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

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

        getViolationsInRange: tool({
          description:
            "Use this tool to get all violations recorded in the specified range.",
          parameters: z.object({
            from: z.string(),
            to: z.string(),
          }),
          execute: ({ from, to }) =>
            getAllViolationsInRange({
              from: new Date(from),
              to: new Date(to),
            }),
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
