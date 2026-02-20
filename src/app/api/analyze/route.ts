import { NextResponse } from "next/server";
import { orchestrateAnalysis } from "@/lib/agents/orchestrator";

export async function POST(request: Request) {
    try {
        const { transcript } = await request.json();

        if (!transcript) {
            return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            console.warn("No OPENAI_API_KEY set, returning mock data.");
            return NextResponse.json({
                painPoints: [
                    { point: "Budget constraints in Q3", severity: "high" },
                ],
                objections: ["Not sure if ROI justifies the cost right now."],
                authorityPositioning: { status: "Champion", notes: "Needs VP sign-off." },
                emotionalShifts: [{ tone: "Defensive", details: "Became defensive when asked about current stack." }],
                dealProbability: 65,
                closingStrategy: "Focus on the time-savings from reporting automation.",
                sdrTargetPersona: "Director of IT / CTO at Mid-Market SaaS",
                sdrSequence: [
                    "Subject: Scaling tech stack ROI without adding headcount",
                    "Subject: Quick question on your Q3 data pipeline",
                    "Subject: Any thoughts on the automation case study?"
                ],
                financialTiers: [
                    { tierName: "Starter", description: "Default tools", priceIndication: "$499/mo" },
                    { tierName: "Growth", description: "Advanced limits + Support", priceIndication: "$999/mo" },
                    { tierName: "Enterprise", description: "Whiteglove Setup", priceIndication: "$3,000/mo" }
                ]
            });
        }

        const result = await orchestrateAnalysis(transcript);
        return NextResponse.json(result);

    } catch (error) {
        console.error("API Error in Orchestrator:", error);
        return NextResponse.json({ error: "Failed to process transcript orchestrations" }, { status: 500 });
    }
}
