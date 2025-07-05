// lets make a translator
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config"

const msgs = [
    new SystemMessage("translate into urdu"),
    new HumanMessage("how are you?")
]

const llm = new ChatGoogleGenerativeAI({
    apiKey:process.env.GOOGLE_API_KEY,
    model:"gemini-1.5-flash",
    temperature:0.5
})

const resp = await llm.invoke(msgs)
console.log(resp.content);
