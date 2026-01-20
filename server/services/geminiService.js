const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeWithGemini = async (jobTitle, jobDescription, resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this resume for the role of ${jobTitle}.
      JD: ${jobDescription}
      Resume: ${resumeText.substring(0, 8000)}
      
      Return ONLY a JSON object:
      {"score": number, "summary": "string"}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // CLEANING: Remove any markdown backticks if Gemini adds them
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const data = JSON.parse(text);
    console.log("-----------------------------------------");
    console.log("✅ ANALYSIS SUCCESSFUL");
    console.log("Score:", data.score);
    console.log("-----------------------------------------");
    return data;

  } catch (error) {
    console.error("❌ Gemini API Service Error:", error.message);
    return null; // Return null so the controller knows it failed
  }
};

module.exports = { analyzeWithGemini };