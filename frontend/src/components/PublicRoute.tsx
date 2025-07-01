import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({children}) => {
  const { isAuthenticated, role } = useAuth();
  
  if (isAuthenticated) {
    const storedData = sessionStorage.getItem('authToken');
    if (storedData){
      if (role === "worker"){
        return <Navigate to={`/asistencia`} replace />;
      } else if (role === "admin"){
        return <Navigate to={`/admin`} replace />;
      }
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
