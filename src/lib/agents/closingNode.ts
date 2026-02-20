import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

export const closingSchema = z.object({
    dealProbability: z.number().min(0).max(100),
    closingStrategy: z.string().describe("A 3-sentence exact reversal script for identified objections"),
});

export async function runClosingNode(objections: string[], emotionalShifts: any[], transcript: string) {
    if (objections.length === 0 && emotionalShifts.length === 0) {
        return { dealProbability: 80, closingStrategy: "No major friction detected. Proceed to standard close." };
    }

    const llm = new ChatOpenAI({
        model: "openrouter/free",
        temperature: 0.1,
        openAIApiKey: process.env.OPENROUTER_API_KEY,
        configuration: {
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: {
                "HTTP-Referer": "https://yace19ai.com",
                "X-Title": "RAN Sales Co-Pilot"
            }
        }
    });

    const prompt = `You are a world-class Closing Optimizer and Sales Strategist using MEDDIC and Challenger Sale frameworks.
Given the following key friction points (objections and emotional shifts) and partial context, generate the ultimate deal probability (0-100) and an exact 3-sentence reversal script to bypass the main objection.

Objections detected:
${JSON.stringify(objections, null, 2)}

Emotional Shifts:
${JSON.stringify(emotionalShifts, null, 2)}

Transcript context:
${transcript.slice(0, 3000)} // Using first 3000 chars

Return valid JSON conforming to the schema.
`;

    try {
        const structuredLlm = llm.withStructuredOutput(closingSchema);
        const result = await structuredLlm.invoke(prompt);
        return result;
    } catch (error) {
        console.error("Closing Node Error:", error);
        return { dealProbability: 50, closingStrategy: "Failed to generate optimized closing strategy." };
    }
}
