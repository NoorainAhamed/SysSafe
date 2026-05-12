import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export interface SecurityAuditResult {
  threats: string[];
  recommendations: string[];
  securityScore: number;
  summary: string;
}

export async function performSecurityAudit(context: string): Promise<SecurityAuditResult> {
  if (!API_KEY) {
    return {
      threats: ["API Key missing. Cannot perform deep security audit."],
      recommendations: ["Configure your GEMINI_API_KEY in the secrets panel."],
      securityScore: 0,
      summary: "Security audit unavailable without AI configuration."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a cybersecurity expert. Perform a simulated security audit based on this browser/device context: ${context}. 
      Return a JSON object with: 
      - threats: list of potential risks (common web risks, browser vulnerabilities).
      - recommendations: list of actionable security steps.
      - securityScore: number from 0-100.
      - summary: brief summary sentence.
      Keep it realistic for a web-based scan.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Audit failed:", error);
    return {
      threats: ["External audit service unreachable."],
      recommendations: ["Check network connection.", "Retry scan later."],
      securityScore: 50,
      summary: "Partial local scan completed. External analysis failed."
    };
  }
}
