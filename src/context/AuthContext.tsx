import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'driver';
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {}, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCurrentUser()
      .then(currentUser => {
        if (currentUser) setUser(currentUser);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
