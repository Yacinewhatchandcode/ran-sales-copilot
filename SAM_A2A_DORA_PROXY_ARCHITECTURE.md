# SAM (SaaS Asset Manager) - A2A Proxy Firewall Architecture
**DORA & EU AI Act Compliant Deployment Operations**

## Core Imperative
No external vendor—including Vercel (Vectal API), OpenRouter, or Supabase—shall possess awareness of the Sovereign internal ecosystem (device types, internal IPs, qualitative user data, network structures). 

To achieve cutting-edge European cyber resilience (DORA) and AI Act compliance, the **SAM Node** operates as an **Air-Gapped Proxy Firewall**.

## A2A (Agent-To-Agent) Encapsulation Protocol

1. **The Internal Swarm (Unrestricted Context)**:
   - SDR, Financial, and Closing Agents have open access to internal memory (Supabase Vector), client transcripts, and strategic models.
   - *These agents are strictly denied internet egress permissions for deployment commands.*

2. **The SAM Node (Restricted Context, Network Egress Allowed)**:
   - SAM is a highly constrained, isolated node. It exclusively holds the `VERCEL_ACCESS_TOKEN`.
   - Before any other agent can deploy an asset, scale infrastructure, or alter DNS via the Vercel MCP, they must send a request to SAM.

3. **Context Stripping (The Firewall)**:
   - When the Internal Swarm requests a deployment via SAM, SAM applies a **Context Guillotine**.
   - It strips all conversational memory, user identities, client data, mobile architecture specifics, and internal routing.
   - SAM translates the request into a rigid, deterministic bash/MCP JSON payload (e.g., `npx vercel deploy --prod`).
   - The Vercel MCP server *only* ever speaks to SAM. It never knows *why* the deployment was commanded or *who* commanded it.

## Compliance Matrices

**1. Digital Operational Resilience Act (DORA) (EU 2022/2554)**
- **Article 9 (Protection and Prevention):** SAM isolates the critical ICT third-party service provider (Vercel) from the core intelligence engine. A compromise on Vercel's edge network cannot cascade into the internal memory swarm.
- **Article 28 (ICT Third-Party Risk):** By reducing the third-party attack surface to a single deterministic API payload with zero data transmission, vendor lock-in risk and data extortion risks are virtually eliminated.

**2. European AI Act (EU 2024/1689)**
- **Article 15 (Accuracy, Robustness, and Cybersecurity):** SAM acts as the designated control layer against model inversion attacks and data poisoning from external vendors. The external vendor receives no LLM inputs, only hardened CLI commands.

**3. GDPR (Data Minimization & Sovereignty)**
- **Data Minimization:** Vercel requires zero PII to execute a deployment. The SAM proxy guarantees that no stray conversational payload accidentally leaks PII into Vercel's logging architecture.

## Execution Blueprint

`[Internal Swarm] -> (Complex Request + PII) -> [SAM Firewall Node] -> (Strips Context -> Creates JSON/CLI command) -> [Vercel MCP]`

The encapsulation is complete. Vercel acts merely as a dumb terminal receiving isolated commands from SAM. The European vision of total digital sovereignty and peace of mind is preserved.
