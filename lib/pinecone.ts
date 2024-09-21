// const PINECONE_INDEX = "semantic-search";
// const PINECONE_CLOUD = "aws";
// const PINECONE_REGION = "us-east-1";

import { Pinecone } from "@pinecone-database/pinecone";

const api_key = process.env.PINECONE_API_KEY!;

const pc = new Pinecone({
  apiKey: api_key,
});
const index = pc.index("smart-street");
// const index = pc.index("Violations_detected");

export { index };
