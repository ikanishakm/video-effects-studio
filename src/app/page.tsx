"use client";

import { presets } from "@/config/presets";

export default function Home() {
  const studioPort = 3001;

  const openInStudio = (compositionId: string) => {
    const studioUrl = `http://localhost:${studioPort}/Video-Effects/${compositionId}`;
    window.open(studioUrl, "_blank");
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Video Effects Studio</h1>
          <p style={styles.subtitle}>
            Choose an effect preset and open it in Remotion Studio
          </p>
          <div style={styles.instructions}>
            <span style={styles.instructionBadge}>1</span>
            Run <code style={styles.code}>npm run remotion:studio</code> in terminal
            <span style={styles.instructionBadge}>2</span>
            Click a card to open the effect
          </div>
        </header>

        <div style={styles.grid}>
          {presets.map((preset) => (
            <div
              key={preset.id}
              style={{
                ...styles.card,
                borderColor: preset.color,
              }}
              onClick={() => openInStudio(preset.compositionId)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 20px 40px ${preset.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
              }}
            >
              <div
                style={{
                  ...styles.cardIcon,
                  backgroundColor: `${preset.color}20`,
                }}
              >
                <span style={styles.iconText}>{preset.icon}</span>
              </div>
              <h2 style={styles.cardTitle}>{preset.name}</h2>
              <p style={styles.cardDescription}>{preset.description}</p>
              <div style={styles.cardFooter}>
                <span
                  style={{
                    ...styles.cardBadge,
                    backgroundColor: `${preset.color}20`,
                    color: preset.color,
                  }}
                >
                  {preset.compositionId}
                </span>
                <span style={styles.openStudio}>Open in Studio</span>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.addMore}>
          <h3 style={styles.addMoreTitle}>Want more effects?</h3>
          <p style={styles.addMoreText}>
            Add new compositions in{" "}
            <code style={styles.code}>src/remotion/compositions/</code> and
            register them in{" "}
            <code style={styles.code}>src/remotion/Root.tsx</code>
          </p>
        </div>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: "100vh",
    padding: "40px 20px",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: 700,
    marginBottom: 12,
    background: "linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: 18,
    marginBottom: 24,
  },
  instructions: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    background: "var(--bg-secondary)",
    padding: "12px 24px",
    borderRadius: 12,
    fontSize: 14,
    color: "var(--text-secondary)",
  },
  instructionBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: "50%",
    background: "var(--accent)",
    color: "white",
    fontSize: 12,
    fontWeight: 600,
  },
  code: {
    background: "var(--bg-tertiary)",
    padding: "4px 8px",
    borderRadius: 6,
    fontFamily: "monospace",
    fontSize: 13,
    color: "var(--accent)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
    marginBottom: 48,
  },
  card: {
    background: "var(--bg-secondary)",
    borderRadius: 16,
    padding: 24,
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 32,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 8,
    color: "var(--text-primary)",
  },
  cardDescription: {
    fontSize: 14,
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardBadge: {
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
  },
  openStudio: {
    fontSize: 13,
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  addMore: {
    textAlign: "center",
    padding: "32px",
    background: "var(--bg-secondary)",
    borderRadius: 16,
    border: "1px dashed var(--border)",
  },
  addMoreTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: "var(--text-primary)",
  },
  addMoreText: {
    fontSize: 14,
    color: "var(--text-secondary)",
  },
};
