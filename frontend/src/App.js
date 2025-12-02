import React, { useState } from "react";
import axios from "axios";

/*
  Mixed theme:
  - Background image (uploaded file): sandbox:/mnt/data/wallpapersden.com_cybersecurity-core_1927x1080.jpg
  - CSS overlays: dark tint, animated grid lines, neon accents
  - Professional card with readable text for interviews
*/

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkUrl = async () => {
    if (!url) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.get(
        `https://phishing-detection-ui-2.onrender.com/predict-url?url=${encodeURIComponent(url)}`
      );
      setResult(res.data);
    } catch (err) {
      setError("Backend not reachable.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.gridOverlay} />

      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logoBox}>🔒</div>
            <div>
              <div style={styles.appName}>CyberSentinel</div>
              <div style={styles.appTag}>ML Phishing URL Analyzer</div>
            </div>
          </div>
        </header>

        <main style={styles.card}>
          <h1 style={styles.title}>Phishing URL Analysis</h1>
          <p style={styles.subtitle}>Enterprise-grade model · ML-only decision</p>

          <div style={styles.inputRow}>
            <input
              aria-label="url-input"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={styles.input}
            />
            <button onClick={checkUrl} style={styles.button}>
              Analyze
            </button>
          </div>

          {loading && <p style={styles.info}>Running model analysis…</p>}
          {error && <p style={styles.error}>{error}</p>}

          {result && (
            <div style={styles.result}>
              <div style={styles.resultHeader}>
                <div style={styles.resultLabel}>Final</div>
                <div
                  style={{
                    ...styles.resultValue,
                    color:
                      result.final_prediction === "Phishing" ? "#ff6b6b" : "#74c69d",
                    borderColor:
                      result.final_prediction === "Phishing" ? "rgba(255,107,107,0.15)" : "rgba(116,198,157,0.12)",
                    boxShadow:
                      result.final_prediction === "Phishing"
                        ? "0 6px 30px rgba(255,107,107,0.06)"
                        : "0 6px 30px rgba(116,198,157,0.06)",
                  }}
                >
                  {result.final_prediction}
                </div>
              </div>

              <div style={styles.metrics}>
                <div style={styles.metric}>
                  <div style={styles.metricLabel}>ML Output</div>
                  <div style={styles.metricValue}>{result.ml_prediction}</div>
                </div>

                <div style={styles.metric}>
                  <div style={styles.metricLabel}>Confidence</div>
                  <div style={styles.metricValue}>
                    {(result.ml_probability * 100).toFixed(2)}%
                  </div>
                </div>
              </div>

              <details style={styles.details}>
                <summary style={styles.summary}>Show features (48)</summary>
                <pre style={styles.pre}>{JSON.stringify(result.features_used, null, 2)}</pre>
              </details>
            </div>
          )}
        </main>

        <footer style={styles.footer}>
          <div>Tech: React · FastAPI · RandomForest</div>
          <div style={{ opacity: 0.75 }}>Designed for demo & interview</div>
        </footer>
      </div>
    </div>
  );
}

/* --- Styles --- */
const BG_IMAGE = 'sandbox:/mnt/data/wallpapersden.com_cybersecurity-core_1927x1080.jpg';

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    backgroundImage: `linear-gradient(rgba(2,8,15,0.72), rgba(2,8,15,0.72)), url("${BG_IMAGE}")`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "#e6eef6",
    padding: 24,
  },

  // subtle animated grid overlay to blend with wallpaper
  gridOverlay: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    background:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 60px)",
    mixBlendMode: "overlay",
    zIndex: 0,
    opacity: 0.9,
    backdropFilter: "blur(2px)",
  },

  container: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: 980,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    alignItems: "stretch",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 18px",
    color: "#cfe8ff",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logoBox: {
    width: 54,
    height: 54,
    borderRadius: 10,
    background:
      "linear-gradient(135deg, rgba(255,80,80,0.14), rgba(0,170,255,0.12))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 6px 30px rgba(2,12,30,0.6)",
  },

  appName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#dbeeff",
  },

  appTag: {
    fontSize: 12,
    color: "#9ec6ff",
    opacity: 0.9,
  },

  card: {
    background: "linear-gradient(180deg, rgba(6,12,22,0.7), rgba(8,10,18,0.78))",
    borderRadius: 12,
    padding: 26,
    border: "1px solid rgba(255,255,255,0.04)",
    boxShadow: "0 8px 40px rgba(2,8,20,0.7)",
    backdropFilter: "blur(6px)",
  },

  title: {
    margin: 0,
    color: "#ffb4b4",
    fontSize: 22,
    fontWeight: 700,
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: "#9fbfff",
    fontSize: 13,
  },

  inputRow: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(10,16,26,0.45)",
    color: "#eaf6ff",
    outline: "none",
    fontSize: 14,
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6)",
  },

  button: {
    padding: "12px 18px",
    borderRadius: 8,
    border: "none",
    background:
      "linear-gradient(90deg, rgba(255,90,90,0.95), rgba(255,140,80,0.95))",
    color: "#08121a",
    fontWeight: 700,
    cursor: "pointer",
    minWidth: 120,
    boxShadow: "0 8px 24px rgba(255,90,90,0.14)",
  },

  info: {
    color: "#a9c7ff",
    marginTop: 8,
    fontSize: 13,
  },

  error: {
    color: "#ff9ea0",
    marginTop: 8,
    fontSize: 13,
  },

  result: {
    marginTop: 18,
    borderRadius: 10,
    padding: 16,
    background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
    border: "1px solid rgba(255,255,255,0.03)",
  },

  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  resultLabel: {
    color: "#9ec6ff",
    fontSize: 13,
    fontWeight: 600,
  },

  resultValue: {
    padding: "10px 14px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 15,
    background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(0,0,0,0.12))",
    border: "1px solid rgba(255,255,255,0.03)",
    minWidth: 140,
    textAlign: "center",
  },

  metrics: {
    display: "flex",
    gap: 12,
  },

  metric: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(0,0,0,0.05))",
    border: "1px solid rgba(255,255,255,0.02)",
  },

  metricLabel: {
    fontSize: 12,
    color: "#9fbfff",
    marginBottom: 6,
  },

  metricValue: {
    fontSize: 16,
    fontWeight: 700,
    color: "#e6eef6",
  },

  details: {
    marginTop: 12,
    color: "#bcd8ff",
  },

  summary: {
    cursor: "pointer",
    outline: "none",
    padding: "6px 8px",
    borderRadius: 6,
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.02)",
  },

  pre: {
    marginTop: 10,
    padding: 12,
    background: "rgba(2,6,12,0.6)",
    borderRadius: 8,
    color: "#cfe8ff",
    fontSize: 12,
    overflowX: "auto",
  },

  footer: {
    marginTop: 14,
    color: "#8fbfff",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    opacity: 0.95,
  },
};

/* Export */
export default App;
