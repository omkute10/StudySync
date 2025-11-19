import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "VITE_GEMINI_API_KEY is not set. Gemini features will not work."
  );
}

const genAI = new GoogleGenerativeAI(apiKey || "");

// Use the correct model name for the Gemini API
const DEFAULT_MODEL = "gemini-1.5-flash-latest";

export const geminiClient = {
  async generateText(prompt: string, model: string = DEFAULT_MODEL) {
    try {
      console.log("Using model:", model);
      const generativeModel = genAI.getGenerativeModel({ model });
      const result = await generativeModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  },

  async generateWithStreaming(
    prompt: string,
    onChunk: (chunk: string) => void,
    model: string = DEFAULT_MODEL
  ) {
    try {
      console.log("Using model for streaming:", model);
      const generativeModel = genAI.getGenerativeModel({ model });
      const result = await generativeModel.generateContentStream(prompt);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        onChunk(text);
      }

      return await result.response;
    } catch (error) {
      console.error("Gemini streaming error:", error);
      throw error;
    }
  },

  async analyzeText(text: string, analysisType: string = "general") {
    const prompt = `Analyze the following text for ${analysisType}:\n\n${text}`;
    return this.generateText(prompt);
  },

  async matchTutorBuddy(
    studentProfile: string,
    tutorProfile: string
  ): Promise<{ score: number; reasoning: string }> {
    const prompt = `
You are an expert in matching students with tutors/study buddies. Analyze the compatibility between these two profiles and provide a match score (0-100) and reasoning.

Student Profile:
${studentProfile}

Tutor/Buddy Profile:
${tutorProfile}

Respond in JSON format:
{
  "score": <number 0-100>,
  "reasoning": "<brief explanation>"
}
`;

    try {
      const response = await this.generateText(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Could not parse response");
    } catch (error) {
      console.error("Match analysis error:", error);
      return { score: 0, reasoning: "Error analyzing compatibility" };
    }
  },

  async generateStudyPlan(topic: string, level: string, duration: string) {
    const prompt = `
Create a detailed study plan for the following:
- Topic: ${topic}
- Level: ${level}
- Duration: ${duration}

Provide a structured, actionable study plan with daily milestones.
`;
    return this.generateText(prompt);
  },
};

export type GeminiClient = typeof geminiClient;
