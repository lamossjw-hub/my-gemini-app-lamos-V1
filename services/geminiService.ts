import { GoogleGenAI } from '@google/generative-ai';
import { ImageFile, ImageSizeOption } from '../types';

// 1. Tên model chuẩn nhất cho bản v1beta của bà
const modelName = 'gemini-1.5-flash';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
  // 2. Dùng đúng Key mới bà vừa dán ở đây
  const ai = new GoogleGenAI("AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk");

  const modelInstance = ai.getGenerativeModel({ model: modelName });

  const systemInstruction = `You are an expert product image editor. Your absolute priority is to preserve the exact shape, texture, and branding of the product.`;

  const parts: any[] = [
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
    const result = await modelInstance.generateContent(parts);
    const response = await result.response;
    
    // Lưu ý: Nếu app bà cần link ảnh thực tế, đoạn này có thể cần chỉnh thêm tùy thuộc vào API trả về
    return [response.text()]; 
  } catch (error) {
    console.error("Lỗi rồi bà ơi:", error);
    throw error;
  }
}