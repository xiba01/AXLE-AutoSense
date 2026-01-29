import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAIResponse({ message, selectedCar, currentScene, history }) {
    try {
        const systemPrompt = `
SYSTEM INSTRUCTIONS:
You are the "AutoSense Premium AI Concierge", an elite automotive expert. 
Your goal is to provide deep, technical, and luxurious insights about the vehicle the user is viewing.

VEHICLE CONFIGURATION (KNOWLEDGE BASE):
${selectedCar ? JSON.stringify(selectedCar, null, 2) : 'No car context provided.'}

CURRENT VISUAL CONTEXT (THE USER IS LOOKING AT THIS):
${currentScene ? JSON.stringify(currentScene, null, 2) : 'No scene context provided.'}

CONSTRAINTS & BEHAVIOR:
1. MANDATORY CONTEXT: You MUST answer using the data provided in the "CURRENT VISUAL CONTEXT". If the user asks about stats (MPG, HP, Range, etc.), look for them in currentScene.slide_content.key_stats first.
2. DETAIL: Do not give short, generic answers. Explain what specs mean within the context of this vehicle.
   - E.g. Instead of "It has 220HP", say "It features a robust 220 horsepower, providing exceptional passing power and a 0-60 time of just 6.6 seconds."
3. SUGGESTED QUESTIONS: When a user asks a question that matches one of our suggestions (e.g., about Efficiency, Performance, or Safety), use the theme_tag from currentScene.slide_content to tailor your response.
4. TONE: Luxurious, highly intelligent, and helpful. Use "we" or "the vehicle" instead of "it".
5. SCENE AWARENESS: If the current scene theme_tag is "efficiency", focus on sustainability and range. If "performance", focus on speed and dynamics.

`;

        // Gemini History Requirements:
        // 1. Must alternate user/model
        // 2. Must start with 'user'
        let mappedHistory = (history || [])
            .map(msg => ({
                role: msg.type === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

        // Filter to ensure history starts with 'user'
        const firstUserIndex = mappedHistory.findIndex(m => m.role === 'user');
        if (firstUserIndex !== -1) {
            mappedHistory = mappedHistory.slice(firstUserIndex);
        } else {
            mappedHistory = [];
        }

        // Filter to ensure alternating roles
        mappedHistory = mappedHistory.filter((msg, i, arr) => !i || msg.role !== arr[i - 1].role);

        const chat = model.startChat({
            history: mappedHistory,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.8,
            },
        });

        // We ALWAYS prepend the System Prompt to ensure the AI has the LATEST scene and car data,
        // as the user might have moved scenes during a conversation.
        const prompt = `[LATEST CONTEXT UPDATE]\n${systemPrompt}\n\n[USER MESSAGE]\n${message}`;

        console.log(`AI Gen [History: ${mappedHistory.length}] - Scene: ${currentScene?.id || 'none'}`);

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini AI Detailed Error:', error);
        throw error;
    }
}
