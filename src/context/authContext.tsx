import React, { createContext, useCallback, useContext, useState } from 'react';
import api from '../services/api';

interface User {
  avatar_url: string;
  email: string;
  id: string;
  name: string;
}
interface AuthState {
  token: string;
  user: User;
}
interface UserLogin {
  email: string;
  password: string;
}
interface AuthContextInterface {
  user: User;
  signIn(user: UserLogin): void;
  signOut(): void;
  updateUser(user: User): void;
}
const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface,
);
export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return {
        token,
        user: JSON.parse(user),
      };
    }

    return {} as AuthState;
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signIn = useCallback(async ({ email, password }: any) => {
    const response = await api.post('sessions', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);
  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (updateData: User) => {
      localStorage.setItem(
        '@GoBarber:user',
        JSON.stringify({ ...data.user, ...updateData }),
      );
      setData({
        token: data.token,
        user: {
          ...data.user,
          ...updateData,
        },
      });
    },
    [setData, data.token, data.user],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
