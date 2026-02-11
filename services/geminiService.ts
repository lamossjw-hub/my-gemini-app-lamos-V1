// Dùng dấu sao (*) để lấy hết vì bản cũ nó không cho lấy lẻ tên GoogleGenAI
import * as GoogleAI from '@google/generative-ai';
import { ImageFile, ImageSizeOption } from '../types';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
// Dùng cách này để ép nó nhận diện đúng bản đồ của Google hiện tại
const genAI = new (GoogleAI as any).GoogleGenerativeAI("AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk");

// Ép model phải dùng bản ổn định nhất
const modelInstance = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
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

  // Thêm ảnh tham khảo
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
    const text = response.text();
    
    // Vì đây là bản Flash nên nó trả về text, bà cứ để nó chạy xem có ra kết quả không nhé
    return [text]; 
  } catch (error) {
    console.error("Lỗi rồi bà ơi:", error);
    throw error;
  }
}