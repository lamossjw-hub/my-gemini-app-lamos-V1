import { ImageFile, ImageSizeOption } from '../types';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
  // 1. Dùng đúng Key mới nhất của bà ở đây
  const apiKey = "AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk";
  
  // 2. Ép dùng API v1 (Bản ổn định) thay vì v1beta để hết lỗi 404
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [
        { text: `You are an expert image editor. Instructions: ${userPrompt}` },
        {
          inlineData: {
            mimeType: originalImage.file.type,
            data: originalImage.base64
          }
        }
      ]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Lỗi server rồi bà ơi");
    }

    const data = await response.json();
    // Trả về kết quả text từ AI
    return [data.candidates[0].content.parts[0].text];

  } catch (error) {
    console.error("Cú chốt cuối cùng bị lỗi:", error);
    throw error;
  }
}