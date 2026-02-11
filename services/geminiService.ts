import * as GoogleAI from '@google/generative-ai';
import { ImageFile, ImageSizeOption } from '../types';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
  // 1. Khởi tạo đầu não
  const genAI = new (GoogleAI as any).GoogleGenerativeAI("AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk");

  // 2. Dùng model này để tránh 404 trên bản v1beta của bà
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `You are an expert product image editor. Preserve the exact shape and texture.`;

  const parts = [
    { text: systemInstruction },
    { text: `User prompt: ${userPrompt || 'Create an appealing product image.'}` },
    {
      inlineData: {
        mimeType: originalImage.file.type,
        data: originalImage.base64,
      },
    },
  ];

  referenceImages.forEach(refImg => {
    parts.push({
      inlineData: {
        mimeType: refImg.file.type,
        data: refImg.base64,
      },
    });
  });

  try {
    const result = await model.generateContent(parts);
    const response = await result.response;
    // Đảm bảo lệnh return này nằm TRONG hàm và TRONG try-catch
    return [response.text()]; 
  } catch (error) {
    console.error("Lỗi rồi bà ơi:", error);
    throw error;
  }
}