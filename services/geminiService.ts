import { GoogleGenAI, Type } from "@google/genai";
import { Skill, RoadmapItem, DebugResult, ExplainerMode, Challenge, ChallengeResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using Flash Lite for low-latency responses as requested
const MODEL_FLASH = 'gemini-flash-lite-latest';
const MODEL_PRO = 'gemini-3-pro-preview';

/**
 * Assess skills based on a code snippet or description.
 */
export const assessSkills = async (input: string): Promise<Skill[]> => {
  const prompt = `
    Analyze the following code or technical description provided by a developer. 
    Identify key programming concepts, languages, and frameworks used.
    Estimate the developer's skill level (0-100) for each identified concept based on complexity, best practices, and patterns used.
    Categorize them into 'weak' (<50), 'moderate' (50-79), or 'strong' (80+).
    
    Input:
    "${input}"
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            name: { type: Type.STRING },
            score: { type: Type.NUMBER },
            status: { type: Type.STRING, enum: ['weak', 'moderate', 'strong'] }
          },
          required: ['category', 'name', 'score', 'status']
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

/**
 * Generate a learning roadmap based on identified weak skills.
 */
export const generateRoadmap = async (weakSkills: string[]): Promise<RoadmapItem[]> => {
  const skillList = weakSkills.join(', ');
  const prompt = `
    Create a 3-day intensive learning roadmap to improve the following weak skills: ${skillList}.
    For each day, provide a main topic, a list of actionable mini-tasks, and suggest what resources/types of examples to look for.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.STRING },
            topic: { type: Type.STRING },
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            resources: { type: Type.ARRAY, items: { type: Type.STRING } },
            status: { type: Type.STRING, enum: ['pending'] } // Default status
          },
          required: ['day', 'topic', 'tasks', 'resources']
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

/**
 * Explain code in a specific mode (streaming).
 */
export const explainCodeStream = async (code: string, mode: ExplainerMode) => {
  let systemInstruction = "";
  switch (mode) {
    case ExplainerMode.BEGINNER:
      systemInstruction = "You are a patient teacher. Explain the code simply, avoiding jargon where possible. Focus on logic flow.";
      break;
    case ExplainerMode.INTERVIEW:
      systemInstruction = "You are a technical interviewer. Explain the time and space complexity (Big O). specific algorithms used, and potential trade-offs.";
      break;
    case ExplainerMode.OPTIMIZED:
      systemInstruction = "You are a senior engineer. focus on performance, memory usage, and clean code principles. Suggest refactoring if necessary.";
      break;
  }

  const prompt = `Please explain the following code:\n\n${code}`;

  return await ai.models.generateContentStream({
    model: MODEL_FLASH,
    contents: prompt,
    config: {
      systemInstruction
    }
  });
};

/**
 * Debug an error message.
 */
export const debugError = async (errorLog: string, contextCode?: string): Promise<DebugResult> => {
  const prompt = `
    Analyze this error: "${errorLog}".
    ${contextCode ? `Context Code:\n${contextCode}\n` : ''}
    
    1. Explain WHY it happened.
    2. Provide a code fix or command to fix it.
    3. Identify the underlying concept the user needs to learn to avoid this in the future.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_FLASH,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          fix: { type: Type.STRING },
          concept: { type: Type.STRING }
        },
        required: ['analysis', 'fix', 'concept']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

/**
 * Generate interview questions.
 */
export const generateInterviewQuestion = async (topic: string, difficulty: string): Promise<string> => {
    const prompt = `Generate a single ${difficulty} level technical interview question about ${topic}. Do not provide the answer yet.`;
    
    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: prompt,
    });
    
    return response.text || "Could not generate question.";
}

/**
 * Generate a daily coding challenge.
 */
export const generateDailyChallenge = async (difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<Challenge> => {
    const prompt = `
        Generate a unique coding challenge for a developer.
        Difficulty: ${difficulty}.
        Include a title, description of the problem, and some starter code (boilerplate).
        The challenge should be solvable in a single function.
        Assign an XP value between 50 and 200 based on difficulty.
    `;

    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
                    xp: { type: Type.NUMBER },
                    starterCode: { type: Type.STRING }
                },
                required: ['title', 'description', 'difficulty', 'xp', 'starterCode']
            }
        }
    });

    return JSON.parse(response.text || '{}');
};

/**
 * Evaluate a challenge submission.
 */
export const evaluateChallenge = async (challenge: Challenge, submission: string): Promise<ChallengeResult> => {
    const prompt = `
        You are a coding instructor. Evaluate the user's submission for the following challenge:
        
        Challenge: "${challenge.title}"
        Description: "${challenge.description}"
        
        User Submission:
        "${submission}"
        
        1. Determine if the code correctly solves the problem.
        2. Provide brief feedback (what was good, what could be improved).
        3. Assign a score (0 to ${challenge.xp}). If it doesn't work, score is 0. If it works but is inefficient, score is lower.
    `;

    const response = await ai.models.generateContent({
        model: MODEL_FLASH,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    passed: { type: Type.BOOLEAN },
                    feedback: { type: Type.STRING },
                    score: { type: Type.NUMBER }
                },
                required: ['passed', 'feedback', 'score']
            }
        }
    });

    return JSON.parse(response.text || '{}');
};