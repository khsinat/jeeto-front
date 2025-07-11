import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { account } from '@/lib/appwrite';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminRoute: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndAdminStatus();
  }, []);

  const checkAuthAndAdminStatus = async () => {
    try {
      // Check if user is authenticated
      const userAccount = await account.get();
      setIsAuthenticated(true);
        console.log("the user is",userAccount.labels)
      // Check if user has admin role
      const hasAdminRole = userAccount.labels.includes('admin') || 
                          userAccount.labels.includes('Admin') ||
                          userAccount.labels.includes('ADMIN');

      if (hasAdminRole) {
        setIsAdmin(true);
      } else {
        toast.error('Admin access required');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      toast.error('Please log in to access admin features');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 