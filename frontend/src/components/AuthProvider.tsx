import React, { createContext, useContext, useState, useEffect } from 'react';


const base = import.meta.env.VITE_BASE_BACKEND_URL
const login_url = base + "/login"

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null,
  login: (dni: string, password: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>("worker");

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const r: string | null = sessionStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setRole(r);
    }
  }, []);

  const login = async (dni: string, password: string, role: string) => {
    try {
      const response = await fetch(login_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "password": password,
            "dni": dni.toString(),
            "role": role
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('role', role);
        setRole(role);
        setIsAuthenticated(true);
      } else {
        alert('Login fallido: ' + data.message);
        console.log('Login fallido: ' + (data.message || 'No se pudo iniciar sesión'));
      }
    } catch (error) {
      console.error('Error durante el login:', error);
      alert('Hubo un error al intentar iniciar sesión.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('role');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
