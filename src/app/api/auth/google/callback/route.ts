import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "No OAuth code received from Google." }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ran-sales-copilot.vercel.app";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    try {
        const formData = new URLSearchParams();
        formData.append("grant_type", "authorization_code");
        formData.append("client_id", clientId);
        formData.append("client_secret", clientSecret);
        formData.append("redirect_uri", redirectUri);
        formData.append("code", code);

        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error(`Google Token Exchange Failed: ${response.statusText}`);
        }

        const tokens = await response.json();

        // Store securely in DB associated with the user/organization
        // For V1 MVP, we save it under the "google_workspace" provider tag
        await supabaseAdmin
            .from("integrations")
            .upsert({ provider: "google_workspace", access_token: tokens.access_token, refresh_token: tokens.refresh_token }, { onConflict: "provider" });

        return NextResponse.redirect(`${baseUrl}/integrations?success=google`);

    } catch (error) {
        console.error("Google OAuth Error:", error);
        return NextResponse.redirect(`${baseUrl}/integrations?error=google_failed`);
    }
}
