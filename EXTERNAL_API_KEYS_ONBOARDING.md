# EXTERNAL APPS CONFIGURATION (Q2 Auto-Execution)
**Option B Operational Steps**

To bring the `crmNode` and `emailNode` out of "Simulation Mode" and into Real-World Execution, you must explicitly provide your B2B authentication tokens. This operates fully server-side, protecting your identity.

## 1. Google Workspace (SDR Automator)
You need a "Service Account Key" to allow RAN to draft emails in background queues.
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Turn on the **Gmail API** in your project.
3. Go to IAM & Admin -> Service Accounts -> Create Service Account.
4. Delegate Domain-Wide Authority so it can impersonate your specific sales rep's email (e.g. `sdr@yace19ai.com`).
5. Generate a JSON Key.
6. Base64 encode the JSON output: `base64 <key.json>`.
7. Paste the Base64 string into Vercel exact env key: `GOOGLE_SERVICE_ACCOUNT`.

## 2. HubSpot CRM (Data Pushing)
To automatically update deals and contacts with Pain Points & Deal Probability:
1. Go to HubSpot Developer Portal -> Private Apps.
2. Create an App called "RAN Sales Intel Engine".
3. Give it Scope: `crm.objects.contacts.read` and `crm.objects.contacts.write`.
4. Grab the **Access Token**.
5. Log into Vercel and paste it as: `HUBSPOT_ACCESS_TOKEN`.

## 3. WebRTC Whisper Model (Voice Layer Q3)
Since you approved Option C (The Voice Layer), the microphone in the browser runs locally, but the speech-to-text goes to OpenAI Whisper API (for high accuracy).
1. Ensure your `OPENAI_API_KEY` is loaded into Vercel.
2. If OpenRouter acts as an alternative, remember that the audio endpoint specifically targets OpenAI's native `/v1/audio/transcriptions`.

Once you have set these 3 Env variables into your Vercel Dashboard, redeploy the application. All Nodes will switch from "Simulated" to "Live Execution". Your SaaS architecture will fully close the B2B loop.
