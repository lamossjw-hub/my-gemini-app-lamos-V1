import { ImageFile, ImageSizeOption } from '../types';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
  const apiKey = "AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk";
  
  // 1. Quay lại v1beta nhưng dùng model có số hiệu -001
  // Đây là model "chân ái" không bị 404 trên bản Beta
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [
        { text: `Task: ${userPrompt || 'Analyze this product image'}` },
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

    const data = await response.json();

    if (!response.ok) {
      // Nếu lỗi, nó sẽ nhả ra chính xác tại sao ở đây
      throw new Error(data.error?.message || "Server Google lại dở quẻ rồi bà ơi");
    }

    return [data.candidates[0].content.parts[0].text];

  } catch (error) {
    console.error("Lỗi rồi:", error);
    throw error;
  }
}