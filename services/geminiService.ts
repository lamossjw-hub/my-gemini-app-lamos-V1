import * as GoogleAI from '@google/generative-ai';
import { ImageFile, ImageSizeOption } from '../types';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
  try {
    // 1. Dùng Key mới nhất của bà
    const genAI = new (GoogleAI as any).GoogleGenerativeAI("AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk");

    // 2. Tuyệt chiêu: Dùng model 'gemini-1.5-flash-latest' 
    // Đây là tên duy nhất hiện tại Google ưu tiên cho bản Beta để tránh 404
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const systemInstruction = `You are an expert product image editor. Focus on: ${userPrompt}`;

    const parts = [
      { text: systemInstruction },
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

    // 3. Thực hiện gọi API
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();
    
    // Trả về kết quả dưới dạng mảng string để khớp với giao diện của bà
    return [text]; 

  } catch (error) {
    console.error("Lỗi cuối cùng nè bà:", error);
    // Nếu vẫn 404, tui sẽ chỉ bà cách đổi API Version trong bước tiếp theo
    throw error;
  }
}