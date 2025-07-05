// didnt work as expected so pause for now

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Replicate from "replicate";
import "dotenv/config";

// Initialize Replicate with your API key
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
});

// Use the actual version ID of the Flux-Dev model
const modelVersion =
  "black-forest-labs/flux-dev:96c60a0a5e99d62ffb5e8c8b0cb90a5ec1757a3f55d219b876b0b5313aa72e0d";

const generateImageTool = tool(
  async ({ prompt }) => {
    const prediction = await replicate.predictions.create({
      version: modelVersion,
      input: { prompt },
    });

    console.log("🧪 Prediction Result:", prediction);

    const imageUrl =
      Array.isArray(prediction.output) && prediction.output.length > 0
        ? prediction.output[0]
        : null;

    if (!imageUrl) {
      return [
        `⚠️ Could not generate image for: "${prompt}"`,
        {
          imageUrl:
            "https://dummyimage.com/600x400/000/fff&text=Image+Unavailable",
        },
      ];
    }

    return [
      `🖼️ Here is your AI-generated image for: "${prompt}"`,
      {
        imageUrl,
      },
    ];
  },
  {
    name: "ImageGeneratorFluxDev",
    description: "Generates an image from a prompt using Flux-Dev on Replicate.",
    schema: z.object({
      prompt: z.string(),
    }),
    responseFormat: "content_and_artifact",
  }
);

// Test it
const prompt = "A futuristic floating city in the clouds";
const response = await generateImageTool.invoke({ prompt });

if (Array.isArray(response) && response.length === 2) {
  const [caption, artifact] = response;
  console.log("📢 Caption:", caption);
  console.log("🌐 Image URL:", artifact?.imageUrl ?? "No image found.");
} else {
  console.error("❌ Unexpected response format:", response);
}
