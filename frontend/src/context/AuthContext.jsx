import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const recoveredUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
                                                              // Henrique Agostinetto Piva
    if (recoveredUser && token) {
      setUser(JSON.parse(recoveredUser));
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cpf: username, 
          senha: password 
        }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }

        const userResponse = await fetch('http://localhost:8000/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setAuthenticated(true);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}