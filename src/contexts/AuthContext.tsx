import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  userData: any | null; // Stores the profile data (role, interests, etc.)
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  // Signup function: Creates Auth user AND Firestore document
  const signup = async (email: string, pass: string, additionalData: any) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Save extra profile details to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      ...additionalData,
      createdAt: new Date().toISOString()
    });
    
    setUserData(additionalData);
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user profile from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};