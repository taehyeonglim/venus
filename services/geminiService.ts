
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeFace = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this facial image and provide an aesthetic evaluation in Korean. 
    Act as a professional aesthetician and style consultant.
    Be positive, encouraging, and detailed.
    Analyze:
    - Overall aesthetic score (0-100)
    - Symmetry (0-100)
    - Skin clarity/health (0-100)
    - Facial Harmony (proportions) (0-100)
    - Visual Aura/Vibe (0-100)
    - Detailed feedback (at least 3 sentences)
    - Mention a celebrity with similar features/vibes.
    - List 3 best features.
    - Provide 1 specific style advice (e.g., haircut, eyewear, or colors).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] || base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            categories: {
              type: Type.OBJECT,
              properties: {
                symmetry: { type: Type.NUMBER },
                skinTone: { type: Type.NUMBER },
                facialHarmony: { type: Type.NUMBER },
                visualAura: { type: Type.NUMBER }
              },
              required: ["symmetry", "skinTone", "facialHarmony", "visualAura"]
            },
            feedback: { type: Type.STRING },
            celebrityLookalike: { type: Type.STRING },
            bestFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            styleAdvice: { type: Type.STRING }
          },
          required: ["overallScore", "categories", "feedback", "bestFeatures", "styleAdvice"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("얼굴 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
};
