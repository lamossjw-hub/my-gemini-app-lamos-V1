
import { GoogleGenAI } from '@google/genai';
import { ImageFile, ImageSizeOption } from '../types';

const model = 'gemini-1.5-flash-8b';

export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  // Create a new instance right before use to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: "AIzaSyCxIeZSiojvZtamt7g9KGUKSGSkmLZ5T_Y" });

  const systemInstruction = `You are an expert product image editor. Your absolute priority is to preserve the exact shape, texture, and branding of the product in the original image (ori a). Use the reference images (ref a, ref b, ref c, ref d) ONLY for lighting, background style, and atmosphere. Do not distort the product in 'ori a'.`;

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
  
  const imageConfig = {
      imageConfig: {
        aspectRatio: sizeOption.aspectRatio,
        imageSize: sizeOption.imageSize || "1K",
      }
  };

  const generationPromises = Array(numImages).fill(0).map(() => 
    ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: imageConfig,
    })
  );

  const responses = await Promise.all(generationPromises);

  const imageUrls = responses.map(response => {
    if (!response || !response.candidates || response.candidates.length === 0) {
      throw new Error('API returned an invalid response structure.');
    }
    
    const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
    if (!imagePart || !imagePart.inlineData) {
      const textPart = response.candidates[0].content.parts.find(part => part.text);
      const errorMessage = textPart ? textPart.text : 'No image data found in response.';
      throw new Error(`API Error: ${errorMessage}`);
    }

    const base64String = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType;
    return `data:${mimeType};base64,${base64String}`;
  });

  return imageUrls;
}
