import { NextResponse } from "next/server";
import { orchestrateAnalysis } from "@/lib/agents/orchestrator";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function POST(request: Request) {
    try {
        const { transcript, email } = await request.json();

        if (!transcript) {
            return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
        }

        if (!process.env.OPENROUTER_API_KEY) {
            console.warn("No OPENROUTER_API_KEY set, returning mock data.");
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

        // --- SUPABASE WIRING: Persistent Memory Saving ---
        if (email && process.env.NEXT_PUBLIC_SUPABASE_URL) {
            console.log("[Orchestrator] Saving execution block to Supabase DB...");

            // 1. Save Raw Transcript
            const { data: transcriptRecord, error: tErr } = await supabaseAdmin
                .from("transcripts")
                .insert({ user_email: email, raw_text: transcript })
                .select()
                .single();

            if (transcriptRecord && !tErr) {
                // 2. Save Analysis Nodes
                await supabaseAdmin
                    .from("analyses")
                    .insert({
                        transcript_id: transcriptRecord.id,
                        deal_probability: result.dealProbability,
                        closing_strategy: result.closingStrategy,
                        sdr_target_persona: result.sdrTargetPersona,
                        sdr_sequence: result.sdrSequence,
                        pain_points: result.painPoints,
                        objections: result.objections,
                        authority_positioning: result.authorityPositioning,
                        emotional_shifts: result.emotionalShifts,
                        financial_tiers: result.financialTiers
                    });
            } else {
                console.error("[Orchestrator] Supabase Transcript Save Error:", tErr);
            }
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error("API Error in Orchestrator:", error);
        return NextResponse.json({ error: "Failed to process transcript orchestrations" }, { status: 500 });
    }
}
