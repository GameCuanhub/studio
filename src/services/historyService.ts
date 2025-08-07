import { db } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
  orderBy,
  limit,
  writeBatch,
} from "firebase/firestore";
import type { ChatSession } from "@/types";

const CHATS_COLLECTION = "chats";

// Get all chat history for a specific user, ordered by most recent
export const getUserHistory = async (userId: string): Promise<ChatSession[]> => {
  try {
    // Query without ordering on the server
    const q = query(
      collection(db, CHATS_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const history: ChatSession[] = [];
    querySnapshot.forEach((doc) => {
      history.push({ id: doc.id, ...doc.data() } as ChatSession);
    });

    // Sort the history on the client-side
    history.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    
    return history;
  } catch (error) {
    console.error("Error getting user history: ", error);
    return [];
  }
};

// Get a single chat session by its ID
export const getChatSession = async (sessionId: string): Promise<ChatSession | null> => {
    try {
        const docRef = doc(db, CHATS_COLLECTION, sessionId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as ChatSession;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting chat session: ", error);
        return null;
    }
}

// Create or update a chat session
export const saveChatSession = async (session: ChatSession): Promise<void> => {
  try {
    const docRef = doc(db, CHATS_COLLECTION, session.id);
    await setDoc(docRef, session, { merge: true }); // merge: true prevents overwriting if document exists
  } catch (error) {
    console.error("Error saving chat session: ", error);
  }
};

// Delete a single chat session
export const deleteChatSession = async (sessionId: string): Promise<void> => {
    try {
        const docRef = doc(db, CHATS_COLLECTION, sessionId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting chat session: ", error);
    }
}

// Clear all chat history for a user
export const clearUserHistory = async (userId: string): Promise<void> => {
    try {
        const q = query(
            collection(db, CHATS_COLLECTION),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        
        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`History cleared for user ${userId}`);
    } catch (error) {
        console.error("Error clearing user history: ", error);
    }
}
