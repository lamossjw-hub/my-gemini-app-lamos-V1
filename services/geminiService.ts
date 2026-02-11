import { ImageFile, ImageSizeOption } from '../types';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  
  const apiKey = "AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk";
  
  // Ép nó dùng bản v1 (bỏ chữ beta đi) để hết lỗi 404
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [
        { text: `Task: ${userPrompt || 'Edit this product image'}` },
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
      throw new Error(data.error?.message || "Lỗi rồi bà ơi");
    }

    // Lấy đoạn text trả về
    return [data.candidates[0].content.parts[0].text];

  } catch (error) {
    console.error("Cú chốt bị lỗi:", error);
    throw error;
  }
}