
export interface QAPair {
  id: string; // Unique ID for the question-answer pair
  questionText: string;
  answer: string;
  timestamp: string; // ISO string for when the answer was received
  uploadedFileUri?: string | null;
  fileName?: string | null;
}

export interface ChatSession {
  id: string; // Firestore document ID
  userId: string; // ID of the user who owns this session
  title: string; // The first question of the session
  messages: QAPair[];
  classLevel: string;
  subject: string;
  startTime: string; // ISO string
}

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    tokenBalance: number;
}
