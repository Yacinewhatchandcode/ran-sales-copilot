import { google } from "googleapis";

/**
 * SDR Automation Node (Gmail / GSuite Integration)
 * Architecture for Auto-Execution Layer (Q2)
 * 
 * Automatically pushes the generated 3-step sequence into the Rep's Gmail Drafts.
 */
export async function runEmailNode(sdrTargetPersona: string, sequence: string[], prospectEmail: string) {
    console.log("[SDR Email Node] Drafting sequence to Google Workspace...");

    const credentialsEncoded = process.env.GOOGLE_SERVICE_ACCOUNT;

    if (!credentialsEncoded) {
        console.warn("[SDR Email Node] No GOOGLE_SERVICE_ACCOUNT found. Simulating draft creation.");
        return { status: "Simulated", draftsCreated: sequence.length };
    }

    try {
        const credentials = JSON.parse(Buffer.from(credentialsEncoded, "base64").toString("utf8"));
        const client = new google.auth.JWT(
            credentials.client_email,
            undefined,
            credentials.private_key,
            ["https://www.googleapis.com/auth/gmail.compose"]
        );

        await client.authorize();
        const gmail = google.gmail({ version: "v1", auth: client });

        // Iterate and draft the 3-step sequence
        for (let i = 0; i < sequence.length; i++) {
            const rawMessage = [
                `To: ${prospectEmail}`,
                "Content-Type: text/plain; charset=utf-8",
                "MIME-Version: 1.0",
                `Subject: ${sequence[i].split(":")[0]} [RAN Follow-Up ${i + 1}]`,
                "",
                sequence[i] // Raw body
            ].join("\n");

            const encodedMessage = Buffer.from(rawMessage)
                .toString("base64")
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "");

            await gmail.users.drafts.create({
                userId: "me", // Delegate access usually handles specific rep emails here
                requestBody: {
                    message: {
                        raw: encodedMessage
                    }
                }
            });
        }

        console.log(`[SDR Email Node] Successfully drafted ${sequence.length} emails.`);
        return { status: "Success", draftsCreated: sequence.length };

    } catch (error) {
        console.error("[SDR Email Node] Draft Creation Failed:", error);
        return { status: "Failed", error: "Google Workspace API refused." };
    }
}
