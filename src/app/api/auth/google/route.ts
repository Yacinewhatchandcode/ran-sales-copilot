import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ran-sales-copilot.vercel.app";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;
    const scopes = "https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/userinfo.email";

    if (!clientId) {
        return NextResponse.json({ error: "GOOGLE_CLIENT_ID missing in Vercel Encrypted Env." }, { status: 400 });
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}&access_type=offline&prompt=consent`;

    return NextResponse.redirect(authUrl);
}
