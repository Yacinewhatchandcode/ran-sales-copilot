import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

export const financialSchema = z.object({
    tierStrategy: z.array(z.object({
        tierName: z.string(),
        description: z.string(),
        priceIndication: z.string()
    })).describe("3-tier SaaS pricing model based on transcript constraints"),
});

export async function runFinancialNode(transcript: string) {
    const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.1 });

    const prompt = `You are a world-class VP of Finance and SaaS Structurer.
Given the following sales transcript context, assess any budget constraints, deal size, or prospect maturity.
Recalculate and output a customized 3-tier product pricing/packaging strategy to maximize MRR/ARR without triggering price resistance.

Transcript context:
${transcript.slice(0, 3000)} // Using first 3000 chars

Return exact JSON structure as requested, strictly mapping to the schema.
`;

    try {
        const structuredLlm = llm.withStructuredOutput(financialSchema);
        const result = await structuredLlm.invoke(prompt);
        return result;
    } catch (error) {
        console.error("Financial Node Error:", error);
        return {
            tierStrategy: [
                { tierName: "Basic", description: "Default entry level feature access.", priceIndication: "$99/mo" },
                { tierName: "Pro", description: "Standard business access.", priceIndication: "$299/mo" },
                { tierName: "Enterprise", description: "Full white-glove onboarding and custom limits.", priceIndication: "Custom" },
            ]
        };
    }
}
