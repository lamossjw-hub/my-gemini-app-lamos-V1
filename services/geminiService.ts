import * as GoogleAI from '@google/generative-ai';
import { ImageFile, ImageSizeOption } from '../types';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
  // 1. Dùng đúng Key mới nhất bà vừa tạo
  const genAI = new (GoogleAI as any).GoogleGenerativeAI("AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk");

  // 2. KHÔNG THÊM "models/" - chỉ để đúng tên model như vầy thôi
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const parts = [
    { text: `You are an expert product image editor. Task: ${userPrompt}` },
    {
      inlineData: {
        mimeType: originalImage.file.type,
        data: originalImage.base64,
      },
    },
  ];

  referenceImages.forEach(refImg => {
    parts.push({
      inlineData: { mimeType: refImg.file.type, data: refImg.base64 },
    });
  });

  try {
    const result = await model.generateContent(parts);
    const response = await result.response;
    // Trả về text để kiểm tra xem nó có chạy không đã bà nhé
    return [response.text()]; 
  } catch (error) {
    console.error("Lỗi cuối cùng nè bà:", error);
    throw error;
  }
}