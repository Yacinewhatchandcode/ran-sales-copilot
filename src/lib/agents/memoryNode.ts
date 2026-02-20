import { supabaseAdmin } from "@/lib/supabase/client";

/**
 * Vector Memory Intelligence (The RAG Brain)
 * Architecture for Auto-Execution Layer (Q2)
 * 
 * Embeds Transcript contexts along with Objection patterns so RAN "remembers"
 * past deals and learns what works for closing.
 */
export async function runVectorMemoryNode(transcriptId: string, transcriptText: string, objections: string[]) {
    console.log("[Vector Memory] Compressing Transcript into High-Dimensional Space...");

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
        console.warn("[Vector Memory] No standard OPENAI_API_KEY found for embeddings. Bypassing Memory Node.");
        return { status: "Bypassed", message: "Embeddings require OpenAI specific token." };
    }

    try {
        // We use standard Fetch for simple isolated Ada-002 Embeddings to keep dependency tree thin.
        const response = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openAiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: `Objections encountered: ${objections.join(", ")}\nContext: ${transcriptText.slice(0, 1500)}`,
                model: "text-embedding-ada-002"
            })
        });

        if (!response.ok) throw new Error("Embedding API Failure");

        const embeddingData = await response.json();
        const vector = embeddingData.data[0].embedding;

        // Push directly to our newly created pgvector Supabase table
        const { error: insertError } = await supabaseAdmin.from("deal_memory").insert({
            transcript_id: transcriptId,
            content: `Objections encountered: ${objections.join(", ")}`,
            embedding: vector,
            metadata: { type: "deal_analysis", vectorModel: "text-embedding-ada-002" }
        });

        if (insertError) {
            console.error("[Vector Memory] Supabase Insertion Failure:", insertError);
            throw insertError;
        }

        console.log("[Vector Memory] 1536-Dimension Vector Successfully Written to Deep Memory.");
        return { status: "Stored", vectorDimension: 1536 };

    } catch (error) {
        console.error("[Vector Memory] Neural Compression Failed:", error);
        return { status: "Failed", error: "Vector generation interrupted." };
    }
}
