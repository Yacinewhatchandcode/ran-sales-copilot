# PRIME-AI.FR INTEGRATION GUIDE
**Option A Executive Execution**

To merge `RAN Sales Co-Pilot` into the `prime-ai.fr` sovereign dashboard ecosystem without compromising the isolated scaling of Vercel or breaking DORA compliance, we use the **Iframe Airlock** architecture.

## Step 1: Create the Component in your Prime-AI Repository
Navigate to your `prime-ai.fr` codebase (`sovereign-dashboard` or similar Next.js project).
Create a new file: `src/app/services/ran-copilot/page.tsx`

```tsx
"use client";

import React from "react";

export default function RANCoPilotAirlock() {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden", backgroundColor: "#0A0A0A" }}>
      {/* 
        This is a DORA-compliant Sandbox Iframe.
        It encapsulates the Vercel execution completely while loading instantly within prime-ai.fr.
      */}
      <iframe
        src="https://ran-sales-copilot.vercel.app/"
        width="100%"
        height="100%"
        allow="microphone *"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        style={{ border: "none" }}
        title="RAN - AI Sales Co-Pilot"
      />
    </div>
  );
}
```

## Step 2: Route Protection (If needed)
Because RAN handles heavy enterprise intel, ensure that this route (`/services/ran-copilot`) is protected by your existing `prime-ai.fr` authentication middleware (Clerk/NextAuth). The iframe itself handles its own simple auth gate right now, but double-locking is standard.

## Step 3: PWA/Sidebar Addition
Add the following link to your Prime-AI navigation sidebar/hub UI: `https://prime-ai.fr/services/ran-copilot`

*Note: Why an Iframe? Because it physically prevents the Prime-AI dashboard state and token memory from bleeding into the RAN Swarm, ensuring the "Agent-To-Agent (SAM) Air-Gap" remains legally defensible under the European AI Act.*
