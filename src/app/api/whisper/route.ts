import { NextResponse } from "next/server";

// We use the Edge runtime for fast streaming, but Whisper audio handling requires specific standard parsing. 
// Standard Node.js runtime is safer for FormData audio blobs.
export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as Blob;

        if (!file) {
            return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
        }

        const openAiKey = process.env.OPENAI_API_KEY;
        if (!openAiKey) {
            console.warn("No OPENAI_API_KEY found. Mocking whisper response.");
            return NextResponse.json({ text: " [Mocked Audio Transcript] I understand the ROI, but our budget is frozen until Q3... " });
        }

        // Prepare payload for OpenAI Whisper
        const outFormData = new FormData();
        outFormData.append("file", file, "audio.webm");
        outFormData.append("model", "whisper-1");
        // Optionally specify English for faster processing or let it auto-detect: 
        // outFormData.append("language", "en");

        console.log("[Voice Layer] Forwarding WebRTC Blob to Whisper-1...");

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openAiKey}`
                // Do NOT set Content-Type header manually here. Fetch will automatically set it with boundary for FormData.
            },
            body: outFormData,
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("[Voice Layer] Whisper API Error:", errorData);
            throw new Error(`Whisper API failed: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ text: data.text });
    } catch (error) {
        console.error("Live Audio Processing Error:", error);
        return NextResponse.json({ error: "Failed to transcribe audio." }, { status: 500 });
    }
}
