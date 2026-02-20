"use client";

import { useState } from "react";
import { Link2, Mail, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import styles from "../page.module.css"; // Reuse the main page styling for speed

export default function IntegrationsPage() {
    const [hubspotLinked, setHubspotLinked] = useState(false);
    const [googleLinked, setGoogleLinked] = useState(false);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.brandRow}>
                    <div className={styles.logo}>RAN // Integrations Control</div>
                    <Link href="/" style={{ color: "var(--accent-gold)", fontSize: "0.8rem", textDecoration: "none" }}>
                        ← Back to Intelligence Hub
                    </Link>
                </div>
                <h1 className={styles.title} style={{ marginTop: "2rem" }}>
                    <span>Secure OAuth</span>{" "}
                    <span className="gold-gradient-text">Connections</span>
                </h1>
                <p className={styles.subtitle}>
                    Link Auto-Execution endpoints. Authorize RAN to push Deals and Draft sequence emails physically into your SaaS.
                </p>
            </header>

            <main className={styles.main} style={{ maxWidth: "800px" }}>

                {/* HubSpot Connection */}
                <div style={{ padding: "2rem", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ background: "#FF7A59", padding: "10px", borderRadius: "8px" }}>
                            <Link2 color="#ffffff" size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#fff" }}>HubSpot CRM</h3>
                            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Push Pain Points and Deal Probabilities directly onto Contacts.</p>
                        </div>
                    </div>
                    <div>
                        {hubspotLinked ? (
                            <span style={{ display: "flex", gap: "0.5rem", color: "#2ed573", alignItems: "center", fontWeight: 600 }}>
                                <CheckCircle size={18} /> Connected
                            </span>
                        ) : (
                            <a href="/api/auth/hubspot" className={styles.btnPrimary} style={{ width: "auto", padding: "0.6rem 1.2rem", background: "rgba(255, 122, 89, 0.1)", color: "#FF7A59", border: "1px solid rgba(255, 122, 89, 0.2)" }}>
                                Connect Hubspot
                            </a>
                        )}
                    </div>
                </div>

                {/* Google Workspace Connection */}
                <div style={{ padding: "2rem", backgroundColor: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ background: "#4285F4", padding: "10px", borderRadius: "8px" }}>
                            <Mail color="#ffffff" size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#fff" }}>Google Workspace / Gmail</h3>
                            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Write 3-Step Sequences automatically as Drafts in your SDR's email.</p>
                        </div>
                    </div>
                    <div>
                        {googleLinked ? (
                            <span style={{ display: "flex", gap: "0.5rem", color: "#2ed573", alignItems: "center", fontWeight: 600 }}>
                                <CheckCircle size={18} /> Connected
                            </span>
                        ) : (
                            <a href="/api/auth/google" className={styles.btnPrimary} style={{ width: "auto", padding: "0.6rem 1.2rem", background: "rgba(66, 133, 244, 0.1)", color: "#4285F4", border: "1px solid rgba(66, 133, 244, 0.2)" }}>
                                Connect Gmail
                            </a>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
