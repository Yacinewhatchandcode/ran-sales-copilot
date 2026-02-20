import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "No OAuth code received from HubSpot." }, { status: 400 });
    }

    const clientId = process.env.HUBSPOT_CLIENT_ID!;
    const clientSecret = process.env.HUBSPOT_CLIENT_SECRET!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ran-sales-copilot.vercel.app";
    const redirectUri = `${baseUrl}/api/auth/hubspot/callback`;

    try {
        const formData = new URLSearchParams();
        formData.append("grant_type", "authorization_code");
        formData.append("client_id", clientId);
        formData.append("client_secret", clientSecret);
        formData.append("redirect_uri", redirectUri);
        formData.append("code", code);

        const response = await fetch("https://api.hubapi.com/oauth/v1/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error(`HubSpot Token Exchange Failed: ${response.statusText}`);
        }

        const tokens = await response.json();

        // Store securely in DB associated with the user/organization
        // For V1 MVP, we can save it globally or under an Admin identifier
        await supabaseAdmin
            .from("integrations")
            .upsert({ provider: "hubspot", access_token: tokens.access_token, refresh_token: tokens.refresh_token }, { onConflict: "provider" });

        return NextResponse.redirect(`${baseUrl}/integrations?success=hubspot`);

    } catch (error) {
        console.error("HubSpot OAuth Error:", error);
        return NextResponse.redirect(`${baseUrl}/integrations?error=hubspot_failed`);
    }
}
