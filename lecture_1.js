import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config"


const llm = new ChatGoogleGenerativeAI({
        apiKey:process.env.GOOGLE_API_KEY,
        model:"gemini-1.5-flash"
})

const resp = await llm.invoke("what is date today in hijri")
console.log(resp.content)