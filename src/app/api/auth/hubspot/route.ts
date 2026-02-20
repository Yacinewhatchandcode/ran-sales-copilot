import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ran-sales-copilot.vercel.app";
    const redirectUri = `${baseUrl}/api/auth/hubspot/callback`;
    const scopes = "crm.objects.contacts.read crm.objects.contacts.write";

    if (!clientId) {
        return NextResponse.json({ error: "HUBSPOT_CLIENT_ID missing in Vercel Encrypted Env." }, { status: 400 });
    }

    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
    return NextResponse.redirect(authUrl);
}
