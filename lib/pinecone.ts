import { Pinecone } from "@pinecone-database/pinecone";

const api_key = process.env.PINECONE_API_KEY!;

const pc = new Pinecone({
  apiKey: api_key,
});
const index = pc.index("smart-street");
// const index = pc.index("violation-data4");

export { index };
