export interface UserSettings {
  apiKey: string;
  userName?: string;
}

export interface AnalysisResult {
  atsScore: number;
  summary: string;
  skills: {
    found: string[];
    missing: string[];
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  improvements: Array<{
    original: string;
    suggestion: string;
    reason: string;
  }>;
  verdict: string;
}

export interface AnalysisRequest {
  fileBase64?: string; // For PDF
  textContext?: string; // For pasted text
  jobDescription?: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  DASHBOARD = 'DASHBOARD',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS'
}