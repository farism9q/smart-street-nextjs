"use server";

import { openai } from "@/lib/openai";

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
