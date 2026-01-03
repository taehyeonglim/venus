
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeFace = async (base64Image: string, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key가 설정되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey });

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
      model: "gemini-2.0-flash",
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
  } catch (error: any) {
    console.error("Analysis failed:", error);

    // Handle specific API errors
    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 400) {
      throw new Error("API Key가 유효하지 않습니다. 올바른 키를 입력해 주세요.");
    }
    if (error?.message?.includes('QUOTA_EXCEEDED') || error?.status === 429) {
      throw new Error("API 사용량 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.");
    }

    throw new Error("얼굴 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
};

// API Key validation helper
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Simple test call
    await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: "Hi" }] }],
    });
    return true;
  } catch {
    return false;
  }
};

// Style simulation using Gemini image generation
export const simulateStyle = async (
  base64Image: string,
  styleAdvice: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key가 설정되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Apply this style transformation to the person in the photo:
    "${styleAdvice}"

    Important guidelines:
    - Keep the person's identity and core facial features intact
    - Only modify styling elements like: hairstyle, hair color, makeup, glasses, accessories
    - Make the transformation look natural and realistic
    - Do NOT alter bone structure or facial proportions
    - If the advice mentions clothing colors, you can add/change visible accessories
    - Maintain the same photo quality and lighting
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
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
        responseModalities: ["image", "text"],
      }
    });

    // Extract the generated image from response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("이미지 생성에 실패했습니다.");
  } catch (error: any) {
    console.error("Style simulation failed:", error);

    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 400) {
      throw new Error("API Key가 유효하지 않습니다.");
    }
    if (error?.message?.includes('QUOTA_EXCEEDED') || error?.status === 429) {
      throw new Error("API 사용량 한도에 도달했습니다.");
    }
    if (error?.message?.includes('SAFETY') || error?.message?.includes('blocked')) {
      throw new Error("안전 정책으로 인해 이미지 변환이 제한되었습니다. 다른 스타일을 시도해 주세요.");
    }

    throw new Error("스타일 시뮬레이션 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
};
