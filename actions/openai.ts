"use server";

import { openai } from "@/lib/openai";
import { searchEmbedding } from "@/actions/pinecone";
import { Metadata } from "@/types/pinecone-record";
import { CoreMessage, streamText } from "ai";
import { openai as openaisdk } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";

export async function getEmbedding(text: string) {
  try {
    const response = await openai.embeddings.create({
      // TODO: Change the model name to the one the suits arabic text
      model: "text-embedding-ada-002",
      input: text,
    });

    const embedding = response.data[0].embedding;

    if (!embedding) throw Error("Error generating embedding.");

    return embedding;
  } catch (error) {
    throw Error("Error generating embedding.");
  }
}

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
          month: ${data.month}
          latitude: ${data.latitude}
          longitude: ${data.longitude}
        `
    )
    .join("\n");

  return `
  Query: ${query}

  Answer based on below information: ${infos}
  `;
}

export async function generateResponse(query: string) {
  const stream = createStreamableValue("");

  const embeddings = await getEmbedding(query);

  const { matches } = await searchEmbedding(embeddings);

  const metadata = matches
    .map(data => data.metadata)
    .filter(Boolean) as Metadata[];

  const question = prepareQuestionToGPT(query, metadata);

  const instructionMessage: CoreMessage = {
    role: "system",
    content: question,
  };

  (async () => {
    const { textStream } = await streamText({
      model: openaisdk("gpt-4o") as any,
      messages: [instructionMessage],
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
