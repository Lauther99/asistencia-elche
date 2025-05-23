import React, { createContext, useContext, useState, useEffect } from 'react';


const base = import.meta.env.VITE_BASE_BACKEND_URL
const login_url = base + "/login"

interface AuthContextType {
  isAuthenticated: boolean;
  login: (dni: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (dni: string, password: string) => {
    try {
      const response = await fetch(login_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "password": password,
            "dni": dni.toString(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        sessionStorage.setItem('authToken', data.token);
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
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
