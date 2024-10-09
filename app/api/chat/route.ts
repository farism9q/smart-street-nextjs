import {
  getAllViolation,
  getTotalViolationsBasedOnYear,
  getAllViolationsInRange,
  getViolationsBasedOnInterval,
  getViolationsSummaryBasedOnDate,
  getViolationsByStreetName,
  getViolationsByViolationType,
  getViolationsByLocation,
} from "@/actions/violation";
import { CurrentDate, Interval } from "@/types/violation";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, CoreMessage, tool } from "ai";
import { addDays, endOfYear, startOfYear } from "date-fns";
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
      system: `You are a helpful assistant. Use the provided tools to answer the user's questions about traffic violations in Riyadh.
      Here is the user's question: ${userQuery}.
      If the information cannot be found in the tools, respond with "لا أعرف"`,
      temperature: 0.5,
      maxSteps: 10,
      tools: {
        getViolationsStats: tool({
          description: `Retrieve the total violations, summary of violations, and highest violations on day recorded based on date. If asked of current year, month, week, or day, just use 'current' (only) as parameter. If asked of a specific year, month, week, or day, set the year, month, week, or day as parameter.`,
          parameters: z.object({
            year: z.number().optional(),
            month: z.number().optional(),
            day: z.number().optional(),
            current: z.enum([
              CurrentDate.year,
              CurrentDate.month,
              CurrentDate.week,
              CurrentDate.day,
            ]),
          }),
          execute: ({ year, month, day, current }) => {
            return getViolationsSummaryBasedOnDate({
              year,
              month,
              day,
              current,
              dateFromFrontend: false,
            });
          },
        }),

        getTotalViolationsBasedOnYear: tool({
          description:
            "Get the total number of violations recorded in the specified year.",
          parameters: z.object({
            year: z.number(),
          }),
          execute: ({ year }) => getTotalViolationsBasedOnYear(year),
        }),

        getViolationsInRange: tool({
          description: `Use this tool to get all violations recorded in the specified range.
          Use this tool in case a questions like retreiving 'yesterday', 'previous week' or 'last month' counts or total is asked. NOTE: Current date is ${new Date()}.
          If a summary is asked, set 'summary' to true. If only the count is asked, set 'retreiveCount' to true.
          
          `,
          parameters: z.object({
            from: z.string(),
            to: z.string(),
            retreiveCount: z.boolean().optional(),
            summary: z.boolean().optional(),
          }),
          execute: ({ from, to, retreiveCount, summary }) =>
            getAllViolationsInRange({
              from: new Date(from),
              to: new Date(to),
              dateFromFrontend: false,
              action: {
                retreiveCount,
                summary,
              },
            }),
        }),

        getViolationsBasedOnStreetName: tool({
          description:
            "Retrieve all violations recorded on the specified street name. If no range is specified, set 'from' and 'to' undefined.",
          parameters: z.object({
            streetName: z.string(),
            from: z.any(),
            to: z.any(),
          }),
          execute: ({ streetName, from, to }) =>
            getViolationsByStreetName({
              streetName,
              from,
              to,
            }),
        }),

        getViolationsBasedOnViolationType: tool({
          description:
            "Retrieve all violations recorded based on the specified violation type. If no range is specified, set 'from' and 'to' undefined. If the violation type is not 'overtaking from right' or 'overtaking from left', just say 'Sorry, we currently have only two types: overtaking from right and left'.",
          parameters: z.object({
            violationType: z.enum([
              "overtaking from right",
              "overtaking from left",
            ]),
            from: z.any(),
            to: z.any(),
          }),
          execute: ({ violationType, from, to }) =>
            getViolationsByViolationType({
              violationType,
              from,
              to,
            }),
        }),

        getViolationsBasedOnLatLong: tool({
          description:
            "Retrieve all violations recorded based on the specified latitude and longitude.",
          parameters: z.object({
            lat: z.number(),
            long: z.number(),
          }),
          execute: ({ lat, long }) =>
            getViolationsByLocation({
              latitude: lat,
              longitude: long,
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

    console.log(result.toolCalls);

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}
