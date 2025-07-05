// lets create prompt template
/* why even use prompt template in first place??
Asnwer:
| Feature         | Benefit                              |
| --------------- | ------------------------------------ |
| Reusability     | Same template, different values      |
| Cleaner prompts | No messy string concatenation        |
| Chainable       | Works in larger chains/pipelines     |
| Structure       | Easier to trace/debug with LangSmith |
*/

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import "dotenv/config"

const llm = new ChatGoogleGenerativeAI({
    apiKey:process.env.GOOGLE_API_KEY,
    model:"gemini-1.5-flash",
    temperature:0.7
})

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system","translate the following from english to {language}"], // also injected
    ["user","{text}"] // user input
])

const promptValue = await promptTemplate.invoke({language:"urdu",text:"what are you doing bro?"})
const resp = await llm.invoke(promptValue)

console.log(resp.content)