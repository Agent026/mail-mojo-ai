export interface Email {
  id: string;
  subject: string;
  sender: string;
  body: string;
  timestamp: Date;
  analysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    summary: string;
    keywords: string[];
  };
  draftResponse?: string;
  sent: boolean;
  isTriaged?: boolean;
}

export interface AIAnalysisProps {
  analysis?: Email['analysis'];
  onAnalyze: () => void;
  isAnalyzing: boolean;
}