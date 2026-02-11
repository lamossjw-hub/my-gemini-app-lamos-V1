// 1. Khởi tạo đầu não (Dùng Key mới của bà nhé)
  const genAI = new (GoogleAI as any).GoogleGenerativeAI("AIzaSyCfGwZHzXJzF58vVyRFhQ36huPsZKUxMYk");

  // 2. Đặt tên biến là 'model' (để không bị lỗi "not defined")
  // Dùng tên model này là chắc ăn nhất cho bản v1beta
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemInstruction = `You are an expert product image editor. Preserve the exact shape and texture.`;

  const parts = [
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
    // 3. Gọi đúng biến 'model' đã khai báo ở trên
    const result = await model.generateContent(parts);
    const response = await result.response;
    return [response.text()]; 
  } catch (error) {
    console.error("Lỗi rồi bà ơi:", error);
    throw error;
  }