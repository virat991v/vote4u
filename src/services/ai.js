import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyC6gdOadZtbWfVn_-VkjBZvc2mtGiEuF0o';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function getAIExplanation(step) {
  const prompts = {
    'landing': "Act as an educational assistant. Explain in 2 short sentences why it is important to vote.",
    'registration': "Act as an educational assistant. Explain in 2 short sentences what voter registration is and why it's the first step.",
    'voting': "Act as an educational assistant. Explain in 2 short sentences how to use an Electronic Voting Machine (EVM).",
    'results': "Act as an educational assistant. Explain in 2 short sentences how votes are counted and results are declared."
  };

  const prompt = prompts[step];
  if (!prompt) return "I'm your AI guide!";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI API Error - Using Fallback:', error.message);
    return getFallbackExplanation(step);
  }
}

function getFallbackExplanation(step) {
  const fallbacks = {
    'landing': "Voting is your right and responsibility. It lets you choose who makes decisions for your community.",
    'registration': "Registration adds your name to the official voter list. You cannot vote unless you are registered first.",
    'voting': "On the EVM, press the blue button next to your chosen candidate's symbol. You will hear a beep confirming your vote.",
    'results': "Once voting ends, the EVMs are sealed and counted securely. The candidate with the most votes wins."
  };
  return fallbacks[step] || "I'm your AI guide!";
}
