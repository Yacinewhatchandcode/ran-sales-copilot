# RAN Sales Co-Pilot
**GO-TO-MARKET (GTM) EXECUTION PLAN**

**Status:** Code Complete. Deployed on Web, iOS, and Android.
**Objective:** Secure 5 B2B SaaS teams as "Founding Members" (Lifetime pricing lock).

## Phase 1: The Live Ammunition Test (Days 1-2)
**Objective:** Build absolute conviction in the product's outputs before facing prospects.
1. **Source Raw Transcripts:** Extract 3 real sales transcripts from your own past calls or find examples of B2B sales transcripts online.
2. **Execute on Mobile:** Open the RAN app on your iPhone/Android. Drop the transcript.
3. **Verify Output Quality:**
   - Are the _Pain Points_ accurate?
   - Is the _Objection Reversal_ sharp and usable in real-time?
   - Does the _SDR Sequence_ sound like a human, not a generic robot?
4. **Benchmark:** Ensure the response arrives in under 15 seconds.

## Phase 2: "The Wedge" Outreach (Days 3-7)
**Target:** VPs of Sales, Head of RevOps, Sales Directors at Mid-Market SaaS ($1M - $10M ARR).
**Channel:** LinkedIn Voice Notes & Email.

**The Outreach Script:**
> "Hey [Name], I noticed your SDRs are likely dropping 30% of deals between Discovery and Proposal because of undetected micro-objections. 
> I built a private intelligence layer that intercepts these objections from raw call transcripts and writes the exact reversal scripts for your team.
> I have room for 5 founding teams to test this on their own dead deals. Let me run one of your lost call transcripts through it live. If it doesn't find the exact reason you lost the deal, hang up on me."

## Phase 3: The 10-Minute Demo (Live Execution)
**Objective:** Deliver the "Aha!" moment instantly. (Use `RAN_10_MIN_PITCH_SCRIPT.md`)
1. **No Slides:** Refuse to show a slide deck.
2. **The Sacrifice:** Ask the prospect to provide a transcript of a deal they *recently lost* or that *stalled*.
3. **The Reveal:** Run the transcript through RAN live on screen.
4. **The Close:** Show them the Deal Probability Score and the exact Objection Reversal they *should* have used. Explain that RAN can do this for their entire CRM automatically (Q2).
5. **The Offer:** Lock them into the "Founding Member" tier ($999/mo or $5k/yr) in exchange for raw feedback and data pipelines.

## Phase 4: Feedback Loop & Q2 Trigger
As the 5 founding members use the tool:
1. Monitor the Supabase `analyses` and `deal_memory` tables.
2. Identify UI friction points.
3. Once data flows consistently, trigger the development of the Auto-Execution Layer (HubSpot API & Gmail API integration).
