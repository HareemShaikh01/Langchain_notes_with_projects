// lets make a streaming bot
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import "dotenv/config"


const llm = new ChatGoogleGenerativeAI({
        apiKey:process.env.GOOGLE_API_KEY,
        model:"gemini-1.5-flash"
})

const messages = [
  new SystemMessage("You are a creative storyteller."),
  new HumanMessage("Tell me a short bedtime story about a brave squirrel."),
];

const stream = await llm.stream(messages)

const storyChunks = []

for await (const chunk of stream){
    storyChunks.push(chunk.content)
    process.stdout.write(chunk.content)
}

console.log("\n\n story completed")