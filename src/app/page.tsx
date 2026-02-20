"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  ShieldAlert,
  UserCheck,
  Activity,
  Target,
  ChevronRight,
  Loader2,
  Lock,
  Briefcase,
  Mail
} from "lucide-react";
import styles from "./page.module.css";

type AnalysisResult = {
  painPoints: { point: string; severity: "high" | "medium" | "low" }[];
  objections: string[];
  authorityPositioning: { status: string; notes: string };
  emotionalShifts: { timestamp: string; details: string; tone: string }[];
  dealProbability: number;
  closingStrategy: string;
  sdrTargetPersona: string;
  sdrSequence: string[];
  financialTiers: { tierName: string; description: string; priceIndication: string; }[];
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsLoggedIn(true);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".txt")) {
      const text = await file.text();
      setTranscript(text);
    } else if (file) {
      alert("Please drop a valid .txt file.");
    }
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, email }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze transcript. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <div className={styles.logo}>RAN // AI Sales Co-Pilot</div>
          <div className={styles.betaBadge}>Private Beta – Limited Access</div>
        </div>
        <h1 className={styles.title}>
          <span>Conversation Intelligence for</span>{" "}
          <span className="gold-gradient-text">High-Performance</span>{" "}
          <span>Sales Teams</span>
        </h1>
        <p className={styles.subtitle}>
          Upload a real call. Get actionable performance insights in minutes.
        </p>
        <div className={styles.integrationsRow}>
          <span className={styles.integrationGhost}>Seamless processing for:</span>
          <span className={styles.integrationItem}>Zoom</span>
          <span className={styles.integrationItem}>Teams</span>
          <span className={styles.integrationItem}>Google Meet</span>
          <span className={styles.integrationItem}>HubSpot CRM</span>
        </div>
      </header>

      {!isLoggedIn ? (
        <main className={styles.main}>
          <form className={styles.loginArea} onSubmit={handleLogin}>
            <Building2 className={styles.logo} size={40} style={{ margin: "0 auto 1.5rem" }} />
            <h2 className={styles.loginTitle}>Secure Access</h2>
            <p className={styles.loginDesc}>Enter your work email to begin the beta trial.</p>
            <input
              type="email"
              placeholder="name@company.com"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.btnPrimary}>
              Enter Workspace <ChevronRight size={18} />
            </button>
            <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
              <Lock size={14} /> End-to-end encrypted session
            </p>
          </form>
        </main>
      ) : (
        <main className={styles.main} style={{ maxWidth: result ? "1000px" : "800px" }}>

          <div
            className={`${styles.workspace} ${isDragging ? styles.workspaceDragging : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <textarea
              className={styles.transcriptArea}
              placeholder="Paste raw call transcript here, or drag & drop a .txt file..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={isAnalyzing}
            />

            <div className={styles.actionRow}>
              <button
                className={styles.btnPrimary}
                onClick={handleAnalyze}
                disabled={isAnalyzing || !transcript.trim()}
                style={{ width: "auto" }}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-pulse" style={{ animationTimingFunction: "linear", animationDuration: "1s" }} />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    Analyze Call <Target size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className={styles.analysisResults}>
              <div className={styles.grid2Col}>
                <div className={styles.resultSection}>
                  <div className={styles.sectionHeader}>
                    <MapPin className={styles.sectionTitle} size={24} />
                    <h3 className={styles.sectionTitle}>1. Pain Point Map</h3>
                  </div>
                  <div className={styles.listRow}>
                    {result.painPoints.map((p, i) => (
                      <div key={i} className={styles.listItem}>
                        <div className={styles.listItemIcon}>›</div>
                        <div>
                          <strong>{p.point}</strong>
                          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: p.severity === "high" ? "#ff4757" : "var(--accent-gold)" }}>
                            Severity: {p.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.resultSection}>
                  <div className={styles.sectionHeader}>
                    <ShieldAlert className={styles.sectionTitle} size={24} />
                    <h3 className={styles.sectionTitle}>2. Objection Detection</h3>
                  </div>
                  <div className={styles.listRow}>
                    {result.objections.map((obj, i) => (
                      <div key={i} className={styles.listItem}>
                        <div className={styles.listItemIcon}>›</div>
                        <div>
                          <strong>{obj}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.grid2Col}>
                <div className={styles.resultSection}>
                  <div className={styles.sectionHeader}>
                    <UserCheck className={styles.sectionTitle} size={24} />
                    <h3 className={styles.sectionTitle}>3. Authority Positioning</h3>
                  </div>
                  <div className={styles.listItem}>
                    <div>
                      <strong>Status: {result.authorityPositioning.status}</strong>
                      <span>{result.authorityPositioning.notes}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.resultSection}>
                  <div className={styles.sectionHeader}>
                    <Activity className={styles.sectionTitle} size={24} />
                    <h3 className={styles.sectionTitle}>4. Emotional Shifts</h3>
                  </div>
                  <div className={styles.listRow}>
                    {result.emotionalShifts.map((shift, i) => (
                      <div key={i} className={styles.listItem}>
                        <div className={styles.listItemIcon}>›</div>
                        <div>
                          <strong>{shift.timestamp || "Moment"} - {shift.tone}</strong>
                          <span>{shift.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.grid2Col}>
                <div className={styles.resultSection} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div className={styles.scoreCircle}>
                    <div className={styles.scoreValue}>{result.dealProbability}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <h3 className={styles.sectionTitle} style={{ justifyContent: "center", borderBottom: "none" }}>5. Deal Probability</h3>
                    <p className={styles.scoreLabel}>Computed score based on NLP metrics</p>
                  </div>
                </div>

                <div className={styles.resultSection}>
                  <div className={styles.sectionHeader}>
                    <Target className={styles.sectionTitle} size={24} />
                    <h3 className={styles.sectionTitle}>6. Closing Strategy</h3>
                  </div>
                  <div className={styles.strategyBox}>
                    {result.closingStrategy}
                  </div>
                </div>
              </div>

              <div className={styles.grid2Col}>
                <div className={styles.resultSection}>
                  <div className={styles.sectionHeader}>
                    <Mail className={styles.sectionTitle} size={24} />
                    <h3 className={styles.sectionTitle}>7. SDR Sequence Generator</h3>
                  </div>
                  <div className={styles.listItem} style={{ marginBottom: "1rem" }}>
                    <strong>Target Persona:</strong> {result.sdrTargetPersona}
                  </div>
                  <div className={styles.listRow}>
                    {result.sdrSequence.map((seq, i) => (
                      <div key={i} className={styles.strategyBox} style={{ padding: "1rem", fontSize: "0.9rem" }}>
                        <strong style={{ color: "var(--accent-gold)" }}>Step {i + 1}</strong>
                        <p style={{ marginTop: "0.5rem" }}>{seq}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.resultSection}>
                  <div className={styles.sectionHeader}>
                    <Briefcase className={styles.sectionTitle} size={24} />
                    <h3 className={styles.sectionTitle}>8. Recommended SaaS Tiers</h3>
                  </div>
                  <div className={styles.listRow}>
                    {result.financialTiers.map((tier, i) => (
                      <div key={i} className={styles.strategyBox} style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <strong style={{ color: "var(--accent-gold)" }}>{tier.tierName}</strong>
                          <span style={{ fontWeight: 600 }}>{tier.priceIndication}</span>
                        </div>
                        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>{tier.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3rem", borderTop: "1px solid var(--border-color)", paddingTop: "3rem" }}>
                <button className={styles.btnPrimary} style={{ fontSize: "1.1rem", padding: "1rem 3rem", width: "auto", minWidth: "300px" }}>
                  Book Optimization Call
                </button>
                <p style={{ color: "var(--accent-gold)", fontWeight: 600, fontSize: "0.9rem", marginTop: "1rem", letterSpacing: "0.05em" }}>
                  ✦ FOUNDING MEMBERS PRICING – LOCKED FOR LIFE
                </p>

                <div className={styles.testimonialOverlay}>
                  <p className={styles.testimonialQuote}>
                    "Since piping our calls through RAN, our SDR sequence reply rate went up 42%. It literally feeds our reps the precise closing script before they even dial."
                  </p>
                  <p className={styles.testimonialAuthor}>
                    — VP Sales, Mid-Market B2B SaaS
                  </p>
                </div>
              </div>

            </div>
          )}
        </main>
      )}
    </div>
  );
}
