const { GoogleGenerativeAI } = require("@google/generative-ai");

const isConfigured = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here";

let genAI = null;
if (isConfigured) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Get a chat response from Gemini AI.
 * @param {string} message - Current user message
 * @param {Array}  doctorsData - List of available doctors {name, specialization, fee, experience, rating}
 * @param {Array}  history - Previous conversation turns [{role:'user'|'model', parts:[{text}]}]
 */
const getChatResponse = async (message, doctorsData = [], history = []) => {
  if (!isConfigured) return { configured: false };

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are MediBot, an intelligent AI health assistant for MediCare Hospital Management Platform.
Your role is to:
1. Help patients understand their symptoms and suggest which type of specialist they should see.
2. Answer general health questions clearly and compassionately.
3. Recommend doctors from the available list when relevant.
4. Assist with questions about appointments, prescriptions, and hospital services.
5. Always remind users that your advice is general and does NOT replace a real doctor's consultation.

Available doctors in our system:
${JSON.stringify(doctorsData, null, 2)}

Guidelines:
- Be warm, empathetic, and professional.
- Keep responses concise and easy to understand (no excessive medical jargon).
- When recommending a doctor, mention their name, specialization, and consultation fee.
- For emergencies, always advise calling emergency services immediately.
- Format responses with line breaks for readability.
- Never diagnose — only suggest specialists and general guidance.`,
    });

    // Build conversation history in Gemini format
    const chat = model.startChat({
      history: history.slice(-10), // Keep last 10 turns to avoid token overflow
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return { configured: true, response: response.text() };
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw error;
  }
};

module.exports = { getChatResponse, isConfigured };
