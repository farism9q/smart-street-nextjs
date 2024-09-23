"use server";

import { getEmbedding } from "@/actions/openai";
import { index } from "@/lib/pinecone";
import { getDay, getMonth } from "@/lib/utils";
import { Metadata } from "@/types/pinecone-record";
import { ViolationType } from "@/types/violation";
import { RecordValues } from "@pinecone-database/pinecone";

export async function insertEmbedding(violation: ViolationType) {
  const violationText = `A ${violation.vehicle_type} was detected ${violation.violation_type} on ${violation.street_name} at ${violation.time} on ${violation.date} at this coords: ${violation.latitude}, ${violation.longitude}`;

  // Get the embeddings
  const embeddings = await getEmbedding(violationText);

  // Store the embeddings
  await index.upsert([
    {
      id: violation._id,
      values: embeddings,
      metadata: {
        vehicle_type: violation.vehicle_type,
        violation_type: violation.violation_type,
        street_name: violation.street_name,
        latitude: violation.latitude,
        longitude: violation.longitude,
        time: violation.time,
        month: getMonth(violation.date), // Month of the violation (e.g. Jan, Feb, etc.)
        day: getDay(violation.date), // Day of the violation (e.g. Monday, Tuesday, etc.)
        isWeekend:
          violation.date.getDay() === 5 || violation.date.getDay() === 6, // Friday or Saturday
      } as Metadata,
    },
  ]);
}

export async function searchEmbedding(embeddings: RecordValues) {
  const results = await index.query({
    vector: embeddings,
    topK: 4,
    includeMetadata: true,
  });

  return results;
}

export async function deleteAllEmbeddings() {
  await index.deleteAll();
}
