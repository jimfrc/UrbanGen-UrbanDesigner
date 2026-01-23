import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  onSnapshot,
  runTransaction,
  Timestamp
} from "firebase/firestore";
import { User, GeneratedImage } from "../types";

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Ensure Firebase is initialized only once and services are registered correctly
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// PORT: Sync User Session
export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const userRef = doc(db, "users", fbUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        callback(userDoc.data() as User);
        // Set up real-time listener for credits
        onSnapshot(userRef, (doc) => {
          if (doc.exists()) callback(doc.data() as User);
        });
      } else {
        // Create initial profile if doesn't exist
        const newUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || "Urban Designer",
          email: fbUser.email || "anonymous@urbangen.ai",
          password: "", // Firebase manages passwords separately, so this is just a placeholder
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
          credits: 100,
          joinedAt: Date.now()
        };
        await setDoc(userRef, newUser);
        callback(newUser);
      }
    } else {
      callback(null);
    }
  });
};

// PORT: Save Design with Atomic Transaction (Deduct credits & save image)
export const saveDesignAndDeductCredits = async (userId: string, image: GeneratedImage, cost: number) => {
  const userRef = doc(db, "users", userId);
  const designRef = doc(collection(db, "designs"));

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) throw new Error("User does not exist!");
    
    const userData = userSnap.data();
    const newCredits = (userData?.credits || 0) - cost;
    if (newCredits < 0) throw new Error("Insufficient credits!");

    // Deduct Credits
    transaction.update(userRef, { credits: newCredits });
    
    // Save Design record
    transaction.set(designRef, {
      ...image,
      userId,
      createdAt: Timestamp.now()
    });

    // Log Transaction
    const logRef = doc(collection(db, "transactions"));
    transaction.set(logRef, {
      userId,
      type: 'consumption',
      amount: cost,
      timestamp: Timestamp.now()
    });
  });
};

// PORT: Add Credits
export const rechargeUserCredits = async (userId: string, amount: number) => {
  const userRef = doc(db, "users", userId);
  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    const currentCredits = userSnap.exists() ? userSnap.data().credits : 0;
    transaction.update(userRef, { credits: currentCredits + amount });
    
    const logRef = doc(collection(db, "transactions"));
    transaction.set(logRef, {
      userId,
      type: 'recharge',
      amount: amount,
      timestamp: Timestamp.now()
    });
  });
};

// PORT: Fetch Gallery
export const fetchPublicGallery = async (max: number = 20) => {
  const q = query(collection(db, "designs"), orderBy("createdAt", "desc"), limit(max));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    // Ensure Timestamp is converted to number for our UI types if needed, 
    // or adjust the interface to accept Timestamp.
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toMillis?.() || Date.now()
    } as GeneratedImage;
  });
};
