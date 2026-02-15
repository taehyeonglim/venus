
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

    const text = response.text;
    if (!text) {
      throw new Error("AI 응답이 비어있습니다. 다시 시도해 주세요.");
    }
    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (error: unknown) {
    console.error("Analysis failed:", error);

    if (error instanceof SyntaxError) {
      throw new Error("AI 응답을 파싱할 수 없습니다. 다시 시도해 주세요.");
    }

    const errorMsg = error instanceof Error ? error.message : '';
    const errorStatus = (error as { status?: number })?.status;

    if (errorMsg.includes('API_KEY_INVALID') || errorStatus === 400) {
      throw new Error("API Key가 유효하지 않습니다. 올바른 키를 입력해 주세요.");
    }
    if (errorMsg.includes('QUOTA_EXCEEDED') || errorStatus === 429) {
      throw new Error("API 사용량 한도에 도달했습니다. 잠시 후 다시 시도해 주세요.");
    }

    if (errorMsg) throw error;
    throw new Error("얼굴 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
    CRITICAL: You must keep the EXACT SAME PERSON's face. Do NOT replace or change the person's identity.

    Task: Apply ONLY the following style changes to this exact person:
    "${styleAdvice}"

    STRICT RULES:
    1. The person's face, eyes, nose, mouth, skin tone, and facial structure MUST remain EXACTLY the same
    2. ONLY change: hairstyle, hair color, makeup, glasses, accessories, or clothing colors
    3. The output image must be recognizable as the SAME PERSON from the input photo
    4. Do NOT generate a different person or a celebrity lookalike
    5. Do NOT alter: face shape, eye shape, nose shape, lip shape, skin color, age, or any facial features
    6. Keep the same photo angle, lighting, and background

    This is a style simulation - the person viewing the result must see THEMSELVES with a new style, not a different person.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
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
        responseModalities: ["IMAGE", "TEXT"],
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
  } catch (error: unknown) {
    console.error("Style simulation failed:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStatus = (error as { status?: number })?.status;

    if (errorMsg.includes('API_KEY_INVALID') || errorStatus === 400) {
      throw new Error("API Key가 유효하지 않습니다.");
    }
    if (errorMsg.includes('QUOTA_EXCEEDED') || errorStatus === 429) {
      throw new Error("API 사용량 한도에 도달했습니다.");
    }
    if (errorMsg.includes('SAFETY') || errorMsg.includes('blocked')) {
      throw new Error("안전 정책으로 인해 이미지 변환이 제한되었습니다. 다른 스타일을 시도해 주세요.");
    }
    if (errorMsg.includes('not found') || errorMsg.includes('404')) {
      throw new Error("이미지 생성 모델을 찾을 수 없습니다. 모델명을 확인해주세요.");
    }
    if (errorMsg.includes('not supported') || errorMsg.includes('INVALID_ARGUMENT')) {
      throw new Error("이미지 생성이 지원되지 않는 모델입니다.");
    }

    throw new Error(`시뮬레이션 오류: ${errorMsg.substring(0, 100)}`);
  }
};

// Get alternative style suggestion
export const getAlternativeStyle = async (
  base64Image: string,
  currentStyle: string,
  previousStyles: string[],
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key가 설정되지 않았습니다.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const previousStylesText = previousStyles.length > 0
    ? `\n\n이전에 제안된 스타일들 (이것들과 다른 새로운 스타일을 제안해주세요):\n${previousStyles.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
    : '';

  const prompt = `
    이 얼굴 사진을 분석하고, 현재 스타일 제안과는 완전히 다른 새로운 스타일을 제안해주세요.

    현재 스타일 제안: "${currentStyle}"
    ${previousStylesText}

    요구사항:
    - 위의 스타일들과 완전히 다른 새로운 방향의 스타일을 제안
    - 헤어스타일, 헤어컬러, 메이크업, 안경, 액세서리, 의상 컬러 중 1-2가지에 집중
    - 이 사람의 얼굴형과 분위기에 어울리는 구체적인 제안
    - 한국어로 2-3문장으로 작성
    - 자연스럽고 실현 가능한 스타일로 제안
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
    });

    const result = response.text?.trim();
    if (!result) {
      throw new Error("스타일 제안을 생성하지 못했습니다.");
    }

    return result;
  } catch (error: unknown) {
    console.error("Alternative style generation failed:", error);

    const errorMsg = error instanceof Error ? error.message : '';
    const errorStatus = (error as { status?: number })?.status;

    if (errorMsg.includes('API_KEY_INVALID') || errorStatus === 400) {
      throw new Error("API Key가 유효하지 않습니다.");
    }
    if (errorMsg.includes('QUOTA_EXCEEDED') || errorStatus === 429) {
      throw new Error("API 사용량 한도에 도달했습니다.");
    }

    throw new Error("스타일 제안 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
};
