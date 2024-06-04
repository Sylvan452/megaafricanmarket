'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { trpc } from '@/trpc/client'; // Adjust the import path accordingly

interface AuthContextType {
  user: any;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: signInMutation } = trpc.auth.signIn.useMutation();

  useEffect(() => {
    // Add logic to fetch the current user if they are already signed in
    // For example, you could check a token in localStorage and fetch the user
  }, []);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await signInMutation({ email, password });
      // Fetch the user after successful sign-in and set the user state
      // setUser(fetchedUser);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const signOut = () => {
    // Logic to sign out the user
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
