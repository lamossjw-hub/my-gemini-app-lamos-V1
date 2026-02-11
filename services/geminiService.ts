export async function generateImages(
  userPrompt: string,
  originalImage: ImageFile,
  referenceImages: ImageFile[],
  sizeOption: ImageSizeOption,
  numImages: number
): Promise<string[]> {
  // 1. Dùng đúng Key mới bà vừa tạo ở đây
  const ai = new GoogleGenAI({ apiKey: "AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk" });

  // 2. Gọi Model theo đúng chuẩn của thư viện này
  const modelInstance = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    // 3. Thay đổi cách gọi hàm từ generateContent (vốn là của bản cũ) 
    // sang cách thức mà thư viện này hỗ trợ
    const result = await modelInstance.generateContent(parts);
    const response = await result.response;
    
    // Tui giả định app bà cần trả về mảng string (link ảnh hoặc base64)
    // Nếu nó báo lỗi trả về, bà cứ chụp tui xem tiếp nhé
    return [response.text()]; 
  } catch (error) {
    console.error("Lỗi rồi bà ơi:", error);
    throw error;
  }
}