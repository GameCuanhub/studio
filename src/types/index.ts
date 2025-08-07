
export interface QAPair {
  id: string; // Unique ID for the question-answer pair
  questionText: string;
  answer: string;
  timestamp: string; // ISO string for when the answer was received
  uploadedFileUri?: string;
  fileName?: string;
}

export interface ChatSession {
  id: string; // Unique ID for the session, typically from the first question's timestamp
  title: string; // The first question of the session
  messages: QAPair[];
  classLevel: string;
  subject: string;
  startTime: string; // ISO string
}

    