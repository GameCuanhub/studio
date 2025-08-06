export interface HistoryItem {
  id: string;
  questionText: string;
  summary: string;
  subject: string;
  classLevel: string;
  answer: string;
  timestamp: string; // ISO string
  uploadedFileUri?: string;
  fileName?: string;
}
