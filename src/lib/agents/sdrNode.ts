import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

export const sdrSchema = z.object({
    targetPersona: z.string(),
    sequence: z.array(z.string()).describe("3-step email sequence based on the pain points"),
});

export async function runSDRNode(painPoints: any[], transcript: string) {
    if (!painPoints || painPoints.length === 0) {
        return { targetPersona: "General", sequence: ["No strong pain points detected to draft sequence."] };
    }

    const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.3 });

    const prompt = `You are a world-class Sales Development Representative (SDR) and Copywriter.
Given the following transcript and specific pain points extracted, identify the core Target Persona and draft a highly-targeted 3-step cold email sequence targeting similar companies.

Pain Points:
${JSON.stringify(painPoints, null, 2)}

Transcript context:
${transcript.slice(0, 3000)} // Using first 3000 chars

Output format must be strictly matched to the schema. 
Step 1: Pain agitation
Step 2: Value proposition
Step 3: Soft Call to Action
`;

    try {
        const structuredLlm = llm.withStructuredOutput(sdrSchema);
        const result = await structuredLlm.invoke(prompt);
        return result;
    } catch (error) {
        console.error("SDR Node Error:", error);
        return { targetPersona: "Unknown", sequence: ["Failed to generate sequence."] };
    }
}
