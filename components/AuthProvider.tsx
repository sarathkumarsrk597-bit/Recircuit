"use client";

import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "@firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "@firebase/firestore";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { auth, db, googleProvider } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function ensureUserDocument(user: User) {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
  const role = user.email?.toLowerCase() === adminEmail ? "admin" : "user";

  if (!snapshot.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName || "ReCircuit user",
      email: user.email || "",
      phone: "",
      role,
      createdAt: serverTimestamp()
    });
    return;
  }

  if (role === "admin" && snapshot.data().role !== "admin") {
    await setDoc(ref, { role }, { merge: true });
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          await ensureUserDocument(currentUser);
        }
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await ensureUserDocument(result.user);
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin:
        Boolean(user?.email) &&
        user?.email?.toLowerCase() ===
          process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase(),
      login,
      logout
    }),
    [loading, login, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
