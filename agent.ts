import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { role, contents, schema, systemInstruction } = req.body;

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'API_KEY is not configured in environment variables.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Use gemini-3-flash-preview for speed and efficiency in agent chains
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: contents }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Model returned no text output.");
    }

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error(`[Agent Proxy Error - ${role}]:`, error);
    return res.status(500).json({ 
      error: error.message || 'The AI Agent encountered an internal reasoning error.',
      details: error.stack
    });
  }
}