import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { runClosingNode } from "./closingNode";
import { runSDRNode } from "./sdrNode";
import { runFinancialNode } from "./financialNode";

const baseAnalyzeSchema = z.object({
    painPoints: z.array(z.object({
        point: z.string(),
        severity: z.enum(["high", "medium", "low"])
    })),
    objections: z.array(z.string()),
    authorityPositioning: z.object({
        status: z.string(),
        notes: z.string()
    }),
    emotionalShifts: z.array(z.object({
        timestamp: z.string().optional(),
        details: z.string(),
        tone: z.string()
    }))
});

export async function orchestrateAnalysis(transcript: string) {
    // Step 1: Base Context Extraction
    const llm = new ChatOpenAI({ model: "gpt-4o", temperature: 0.2 });
    const basePrompt = `Extract core intelligence from this sales transcript.
  
Transcript:
${transcript.slice(0, 4000)}
`;

    console.log("[Orchestrator] Starting Base Extraction...");
    const structuredLlm = llm.withStructuredOutput(baseAnalyzeSchema);
    const baseContext = await structuredLlm.invoke(basePrompt);
    console.log("[Orchestrator] Base Extraction Complete.");

    // Step 2: Parallel Sub-Agent Routing
    // The Orchestrator parallelizes the downstream strategic workloads
    console.log("[Orchestrator] Triggering Sub-Agents in Parallel...");
    const [closingResult, sdrResult, financialResult] = await Promise.all([
        runClosingNode(baseContext.objections, baseContext.emotionalShifts, transcript),
        runSDRNode(baseContext.painPoints, transcript),
        runFinancialNode(transcript)
    ]);
    console.log("[Orchestrator] Sub-Agents Complete.");

    // Step 3: Aggregation Delivery
    return {
        ...baseContext,
        dealProbability: closingResult.dealProbability,
        closingStrategy: closingResult.closingStrategy,
        sdrTargetPersona: sdrResult.targetPersona,
        sdrSequence: sdrResult.sequence,
        financialTiers: financialResult.tierStrategy
    };
}
