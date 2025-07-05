// error in this code will resolve later
import "dotenv/config";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Sample documents to store
const documents = [
  {
    pageContent:
      "LangChain is a framework for building applications with LLMs through composability.",
    metadata: { source: "doc1" },
  },
  {
    pageContent: "",
    metadata: { source: "doc2" },
  },
  {
    pageContent:
      "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It was named after the engineer Gustave Eiffel.",
    metadata: { source: "history1" },
  },
  {
    pageContent:
      "React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components.",
    metadata: { source: "tech1" },
  },
  {
    pageContent:
      "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.",
    metadata: { source: "science1" },
  },
];

// Initialize Gemini embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Store vectors in memory
const vectorStore = await MemoryVectorStore.fromTexts(
  documents.map((doc) => doc.pageContent),
  documents.map((doc) => doc.metadata),
  embeddings
);

// Make retriever
const retriever = vectorStore.asRetriever();

// Ask a natural question
const query = "How do plants make food?";
const results = await retriever.invoke(query);

// Display results
console.log("\n🔍 Retrieved Results:");
results.forEach((doc, i) => {
  console.log(`\nResult ${i + 1}:`);
  console.log("Text:", doc.pageContent);
  console.log("Metadata:", doc.metadata);
});
