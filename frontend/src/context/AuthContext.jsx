
import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {                                                     // hernique agostinetto piva
    const auth = sessionStorage.getItem('isAuth');
    if (auth === 'true') setIsAuth(true);
  }, []);

  const login = (user, pass) => {
    
    if (user === 'abc' && pass === 'bolinhas') {
      sessionStorage.setItem('isAuth', 'true');
      setIsAuth(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('isAuth');
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}