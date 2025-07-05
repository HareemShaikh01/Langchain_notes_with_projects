// lets make chat with pdf now

import "dotenv/config"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";



// STEP 1: load the document
const loader = new PDFLoader("sample pdf.pdf");
const rawDocs = await loader.load();
console.log("document loaded");

console.log(rawDocs[0].pageContent.slice(0, 100)); //  just to check

// STEP 2: split the doc into chunks
const splitter = new CharacterTextSplitter({
  chunkSize: 1000, // Number of characters per chunk
  chunkOverlap: 200, // Overlap for context retention
});


const chunks = await splitter.splitDocuments(rawDocs)
console.log(`document get splitted chunks generated are : ${chunks.length}`)

// STEP 3: generate GEMINI embeddings now =>embeddings are basically vectors format of text which hold its semantics
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey:process.env.GOOGLE_API_KEY
})


// Test with one chunk to see vector structure
const testVector = await embeddings.embedQuery(chunks[0].pageContent);
console.log(`✅ Vector generated with ${testVector.length} dimensions`);
console.log("📌 Vector sample:", testVector.slice(0, 10));


// STEP 4: Store chunks and vectors in memory vector store
console.log("\n📦 Storing document chunks in memory vector store...");
const vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
console.log("✅ Vector store initialized");

// STEP 5: Perform a semantic search
// const query = "How did the Queen try to kill Snow White?";
// console.log(`\n🔍 Searching for: "${query}"...`);
// const results = await vectorStore.similaritySearchWithScore(query, 3);


// STEP 6: Show the result
// if (results.length > 0) {
//   console.log("\n📚 Top result:");
//   console.log("🔎 Text:\n", results[0].pageContent.slice(0, 500));
//   console.log("🧾 Metadata:\n", results[0].metadata);
// } else {
//   console.log("❌ No relevant documents found.");
// }

// alternative for saying if cant find
// const filtered = results.filter(([doc, score]) => score > 0.75);

// if (filtered.length === 0) {
//   console.log("❌ Sorry, I couldn't find any relevant information.");
// } else {
//   console.log("📚 Most relevant result:\n", filtered[0][0].pageContent);
// }

// STEP 5: now lets get our gemini model and start asking it
const llm = new ChatGoogleGenerativeAI({
    apiKey:process.env.GOOGLE_API_KEY,
    model:"gemini-1.5-flash",
    temperature:0.7
})

// make retriever
const retriever = vectorStore.asRetriever()

const query = "What did Little Red Riding Hood bring to her grandmother?";
console.log(`\n🔍 Querying: "${query}"`);

// STEP 6: Retrieve top 3 relevant chunks
const retrievedDocs = await retriever.invoke(query);
const context = retrievedDocs.map(doc => doc.pageContent).join("\n\n");

// STEP 7: Build prompt with context
const fullPrompt = `
You are a helpful assistant. Answer the question using ONLY the context below.

Context:
${context}

Question: ${query}
Answer:
`;


// STEP 8: Send to Gemini chat model
const response = await llm.invoke(fullPrompt);

// STEP 9: Display answer
console.log("\n🤖 Gemini Answer:\n", response.content);