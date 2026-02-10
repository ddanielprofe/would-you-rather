
import { GoogleGenAI, Type } from "@google/genai";
import { Category, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestion = async (
  category: Category,
  history: string[]
): Promise<GeminiResponse> => {
  const categoryPrompts: Record<Category, string> = {
    funny: "Generate a hilariously silly and funny 'Would You Rather' question for middle schoolers (ages 11-14). It should be lighthearted, wacky, and relatable to school or pop culture.",
    thoughtful: "Generate a deep, philosophical, or thought-provoking 'Would You Rather' question for middle schoolers. It should make them think about their values, future, or world perspectives in an accessible way.",
    animal: "Generate a creative 'Would You Rather' question involving animals, pets, or wild creatures for middle schoolers. Think about animal abilities, cross-species scenarios, or funny animal behaviors.",
    gross: "Generate a 'slightly gross' but school-appropriate 'Would You Rather' question for middle schoolers. It should be the kind of thing kids find hilarious and 'eww' at the same time, like eating weird combinations or minor sticky situations."
  };

  const systemInstruction = `
    You are a creative middle school teacher who specializes in 'Would You Rather' icebreakers. 
    Your questions are legendary among 6th, 7th, and 8th graders.
    The language should be modern but not cringey. 
    Always provide two distinct options.
    Do not repeat any of the following previously used questions: ${history.join(", ")}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: categoryPrompts[category],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          optionA: { type: Type.STRING, description: "The first scenario/choice" },
          optionB: { type: Type.STRING, description: "The second scenario/choice" },
        },
        required: ["optionA", "optionB"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return {
      optionA: data.optionA || "Error generating choice A",
      optionB: data.optionB || "Error generating choice B",
    };
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return {
      optionA: "Stay in a room full of puppies",
      optionB: "Stay in a room full of kittens",
    };
  }
};
