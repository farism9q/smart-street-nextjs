import { getEmbedding } from "@/actions/openai";
import { searchEmbedding } from "@/actions/pinecone";
import { Metadata } from "@/types/pinecone-record";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages, CoreMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function prepareQuestionToGPT(query: string, metadata: Metadata[]) {
  const infos = metadata
    .map(
      data =>
        `
          day: ${data.day}
          is weekend: ${data.isWeekend}
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

export async function POST(req: Request) {
  const { messages } = await req.json();

  const query =
    messages[0].content + " " + messages[messages.length - 1].content;

  console.log(query);

  const embeddings = await getEmbedding(query);

  const { matches } = await searchEmbedding(embeddings);

  const metadata = matches
    .map(data => data.metadata)
    .filter(Boolean) as Metadata[];

  console.log(metadata);

  const question = prepareQuestionToGPT(query, metadata);

  const instructionMessage: CoreMessage = {
    role: "system",
    content: question,
  };

  messages.push(instructionMessage);

  console.log(messages);

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages: [...convertToCoreMessages(messages)],
  });

  return result.toDataStreamResponse();
}
