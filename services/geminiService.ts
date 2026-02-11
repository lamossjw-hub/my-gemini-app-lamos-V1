import * as GoogleAI from '@google/generative-ai';
import { ImageFile, ImageSizeOption } from '../types';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
  // Dùng đúng Key mới nhất bà vừa tạo ở đây
  const genAI = new (GoogleAI as any).GoogleGenerativeAI("AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk");

  // Đặt tên là 'model' cho đồng bộ với các lệnh gọi ở dưới
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
  });

  const systemInstruction = `You are an expert product image editor. Preserve the exact shape and texture.`;

  const parts = [
    { text: systemInstruction },
    { text: `User prompt: ${userPrompt}` },
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
    // Gọi đúng biến 'model' đã khai báo ở trên
    const result = await model.generateContent(parts);
    const response = await result.response;
    return [response.text()]; 
  } catch (error) {
    console.error("Lỗi rồi bà ơi:", error);
    throw error;
  }
}