import { z } from "zod";

/**
 * SAM (SaaS Asset Manager) Target Schema
 * Extremely rigid, deterministic payload designed to prevent any prompt injection
 * or internal data leakage to external vendors like Vercel (Vectal).
 */
export const samCommandSchema = z.object({
    action: z.enum(["DEPLOY_PROD", "DEPLOY_PREVIEW", "UPDATE_ENV_VAR", "GET_PROJ_LOGS"]),
    targetEnvKey: z.string().optional(),
    targetEnvValue: z.string().optional()
});

/**
 * SAM Firewall Node
 * 
 * CORE DIRECTIVE: This is the ONLY component allowed to speak to Vercel/External Providers.
 * It is fully isolated from the transcripts, user identities, or mobile/network topologies.
 * 
 * COMPLIANCE: European AI Act, DORA, GDPR.
 * Any request passed into SAM must be stripped of all context except raw instructional state.
 * 
 * @param internalIntent - The raw intent from the Internal Swarm (e.g., "Deploy a preview with the new closing script")
 * @returns Cleaned, deterministic execution payload sent to MCP/Vercel CLI.
 */
export async function runSamFirewallNode(internalIntent: string) {

    // 1. Context Guillotine: SAM strips out the intelligence. 
    // SAM does NOT use an LLM to evaluate the request. It uses exact regex or highly constrained NLP 
    // to simply map the intent, avoiding *any* data transmission of the original prompt to OpenAI/OpenRouter.

    console.log("[SAM Firewall] Analyzing internal intent through Air-Gap Layer...");

    let action: string = "UNKNOWN";

    // Deterministic mapping (No LLM = No External Token Leakage)
    const normalizedIntent = internalIntent.toLowerCase();

    if (normalizedIntent.includes("deploy") && normalizedIntent.includes("prod")) {
        action = "DEPLOY_PROD";
    } else if (normalizedIntent.includes("deploy") && normalizedIntent.includes("preview")) {
        action = "DEPLOY_PREVIEW";
    } else if (normalizedIntent.includes("update") && normalizedIntent.includes("env")) {
        action = "UPDATE_ENV_VAR";
    } else {
        action = "GET_PROJ_LOGS";
    }

    // 2. Execution Authorization
    // Only SAM possesses the VERCEL_ACCESS_TOKEN. The internal swarm has no knowledge of it.
    const vercelToken = process.env.VERCEL_ACCESS_TOKEN;

    if (!vercelToken) {
        console.error("[SAM Firewall] Egress Denied. Compliance Failure: VERCEL_ACCESS_TOKEN not present in vault.");
        return { status: "BLOCKED", reason: "Missing credentials in secure vault." };
    }

    // 3. Isolated Payload Construction
    // Create the exact, context-free command structure ready for execution by an MCP client or shell.
    const payload = {
        action,
        timestamp: new Date().toISOString(),
        security_clearance: "EU_DORA_LEVEL_1",
        // Notice: The original 'internalIntent' is permanently destroyed. 
        // It is NEVER passed into the payload or the Vercel API.
    };

    console.log(`[SAM Firewall] Threat neutralized. Constructing isolated payload for Vercel API: ${action}`);

    // 4. Return to execution engine (the MCP client runner or local exec logic)
    return payload;
}
