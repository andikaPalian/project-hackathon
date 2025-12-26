import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUser, User } from '@/data/mockData';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: (data: Partial<User>) => void;
  updateUser: (data: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('kari_user');
    const onboarded = localStorage.getItem('kari_onboarded');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (onboarded === 'true') {
      setIsOnboarded(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login - in production this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const loggedInUser = { ...mockUser, email };
    setUser(loggedInUser);
    localStorage.setItem('kari_user', JSON.stringify(loggedInUser));
    
    const onboarded = localStorage.getItem('kari_onboarded');
    if (onboarded === 'true') {
      setIsOnboarded(true);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      jurusan: '',
      mataKuliah: [],
      gayaBelajar: '',
      tujuan: [],
      streak: 0,
      lastStudy: '',
      totalMastery: 0,
    };
    
    setUser(newUser);
    setIsOnboarded(false);
    localStorage.setItem('kari_user', JSON.stringify(newUser));
    localStorage.removeItem('kari_onboarded');
  };

  const logout = () => {
    setUser(null);
    setIsOnboarded(false);
    localStorage.removeItem('kari_user');
    localStorage.removeItem('kari_onboarded');
  };

  const completeOnboarding = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      setIsOnboarded(true);
      localStorage.setItem('kari_user', JSON.stringify(updatedUser));
      localStorage.setItem('kari_onboarded', 'true');
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('kari_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOnboarded,
        login,
        register,
        logout,
        completeOnboarding,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}