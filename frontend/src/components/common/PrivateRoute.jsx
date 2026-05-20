import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();    // henrique agostinetto piva

  // aguarda a verificacao do token antes de redirecionar
  if (loading) {
    return <div>carregando...</div>;
  }

 
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;