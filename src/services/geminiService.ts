import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MedicalExplanation {
  explanation: string;
  solutions: string;
  tibetanExplanation: string;
  tibetanSolutions: string;
}

export async function explainMedicalInfo(info: string): Promise<MedicalExplanation> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are a professional medical interpreter specializing in translating complex modern medical information into terms easily understood by laypeople, specifically for a Tibetan-speaking audience.
    
    TASK:
    1. Analyze the provided medical information (symptoms, lab results, prescriptions).
    2. Provide a clear, empathetic explanation in English.
    3. Suggest general wellness solutions or next steps (with a strong disclaimer to consult a doctor).
    4. Translate BOTH the explanation and the solutions into clear, natural Tibetan language.
    
    RESPONSE FORMAT:
    You must return a JSON object with the following structure:
    {
      "explanation": "English explanation",
      "solutions": "English solutions/suggestions",
      "tibetanExplanation": "Tibetan translation of the explanation",
      "tibetanSolutions": "Tibetan translation of the solutions"
    }
    
    CULTURAL SENSITIVITY:
    - Use respectful Tibetan honorifics where appropriate.
    - Keep medical terms simple but accurate.
    - If a specific modern term has no direct Tibetan equivalent, explain the concept.
    
    IMPORTANT:
    - Always start your English explanation by acknowledging that you are an AI and this is not medical advice.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: `Medical Information: ${info}` }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as MedicalExplanation;
  } catch (error) {
    console.error("Error explaining medical info:", error);
    throw error;
  }
}
