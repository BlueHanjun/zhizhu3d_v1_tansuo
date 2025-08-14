import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;