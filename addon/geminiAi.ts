const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyC3Ag076WFNcVsz8eYEhr-Fv9Fo5zxRoVM";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

export async function GeminiAi({prompt}: {prompt: string}) {
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const cleanText = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/- /g, "• ")
            .replace(/\n\s*•/g, "\n•");
    };
    const result = await chatSession.sendMessage(prompt);
    return cleanText(result.response.text());
}
