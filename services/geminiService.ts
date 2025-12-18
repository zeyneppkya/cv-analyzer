import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    atsScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating ATS compatibility." },
    summary: { type: Type.STRING, description: "A brief professional summary of the candidate." },
    skills: {
      type: Type.OBJECT,
      properties: {
        found: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key hard and soft skills found in the CV." },
        missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Important skills that seem missing based on the role/general standards." },
      }
    },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      }
    },
    improvements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING, description: "The original text or concept." },
          suggestion: { type: Type.STRING, description: "The improved version." },
          reason: { type: Type.STRING, description: "Why this change is recommended." },
        }
      }
    },
    verdict: { type: Type.STRING, description: "Final hiring recommendation or overall sentiment." },
  },
  required: ["atsScore", "summary", "skills", "swot", "improvements", "verdict"]
};

export const analyzeCV = async (
  apiKey: string,
  fileBase64: string | null,
  cvText: string | null,
  jobDescription: string
): Promise<AnalysisResult> => {
  
  if (!apiKey) throw new Error("API Key is required");

  // Sanitize API Key to prevent header encoding errors (e.g. "String contains non ISO-8859-1 code point")
  const sanitizedKey = apiKey.trim();

  // Initialize client with user's key
  const ai = new GoogleGenAI({ apiKey: sanitizedKey });

  const systemPrompt = `
    You are an expert HR Recruiter and ATS (Applicant Tracking System) Specialist. 
    Your goal is to analyze the provided CV/Resume against industry standards and, if provided, a specific job description.
    
    1. Analyze formatting, clarity, and impact.
    2. Identify key skills and missing keywords.
    3. Perform a SWOT analysis.
    4. Provide concrete, rewritable improvements for bullet points.
    5. Estimate an ATS compatibility score (0-100).
    
    Be critical but constructive.
  `;

  const userPrompt = jobDescription 
    ? `Analyze this CV for the following Job Description: \n\n${jobDescription}`
    : `Analyze this CV for a general professional role suitable for the candidate's experience level.`;

  const parts = [];
  
  // Add the prompt
  parts.push({ text: userPrompt });

  // Add the PDF or Text
  if (fileBase64) {
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: fileBase64
      }
    });
  } else if (cvText && cvText.trim().length > 0) {
    parts.push({
      text: `\n\nHERE IS THE CANDIDATE'S RESUME CONTENT:\n${cvText}`
    });
  } else {
    throw new Error("No CV content provided. Please upload a PDF or paste text.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2 // Low temperature for consistent analysis
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    } else {
      throw new Error("No response text generated");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};