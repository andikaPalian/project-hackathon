import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/utils/firebase";
import { User } from "@/data/mockData";
import api from "@/utils/api";

interface UserContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loginWithGoogle: () => Promise<void>;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  completeOnboarding: (data: Partial<User>) => void;
  updateUser: (data: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);

      if (currentUser) {
        try {
          const token = currentUser.getIdToken();

          const response = await api.get("/auth/me");

          const backendUser = response.data.user;

          setUser(backendUser);

          setIsOnboarded(!!backendUser.onboardingCompleted);

          localStorage.setItem("KIRA_user", JSON.stringify(backendUser));
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("User terdaftar di Firebase tapi belum ada di DB (Proses Register).");
            setUser(null);
          }
        }
      } else {
        setUser(null);
        setIsOnboarded(false);
        localStorage.removeItem("KIRA_user");
      }
      setLoading(false);
    });
    return () => unsubcribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();

      const response = await api.post("/auth/google", { token: idToken });
      const backendUser = response.data.user;

      setUser(backendUser);
      setIsOnboarded(!!backendUser.onboardingCompleted);
      localStorage.setItem("KIRA_user", JSON.stringify(backendUser));
    } catch (error: any) {
      console.error("Error Google Login:", error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const newUser: User = {
      id: result.user.uid,
      name: username,
      email: email,
      major: "",
      subjects: [],
      learningStyle: "",
      goal: [],
      streak: 0,
      lastStudy: "",
      totalMastery: 0,
    };

    setUser(newUser);
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsOnboarded(false);
    localStorage.removeItem("KIRA_user");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completeOnboarding = async (data: any) => {
    if (user) {
      const payload = {
        major: data.major,
        subjects: data.subjects,
        learningStyle: data.learningStyle,
        goal: data.goal,
      };

      await api.post("/auth/onboarding", payload);

      const updatedUser = {
        ...user,
        major: data.major,
        subjects: data.subjects,
        learningStyle: data.learningStyle,
        goal: data.goal,
        onboardingCompleted: true,
      };

      setUser(updatedUser);
      setIsOnboarded(true);

      localStorage.setItem("KIRA_user", JSON.stringify(updatedUser));
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updated = { ...prevUser, ...data };

      // Simpan ke localStorage agar data persisten saat refresh
      localStorage.setItem("KIRA_user", JSON.stringify(updated));

      return updated;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!firebaseUser,
        isOnboarded,
        loading,
        login,
        register,
        logout,
        completeOnboarding,
        updateUser,
        loginWithGoogle,
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
