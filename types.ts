
export interface AnalysisResult {
  overallScore: number;
  categories: {
    symmetry: number;
    skinTone: number;
    facialHarmony: number;
    visualAura: number;
  };
  feedback: string;
  celebrityLookalike?: string;
  bestFeatures: string[];
  styleAdvice: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  CAPTURE = 'CAPTURE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT'
}
