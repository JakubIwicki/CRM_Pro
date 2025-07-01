
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/models/User';
import { isLoggedIn, user_login } from '@/api/api_user';
import { useToast } from '@/hooks/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    async function checkLoginStatus() {

      if (!user) {
        if (location.pathname !== '/login') {
          navigate('/login', { state: { from: location } });
        }
        return;
      }

      const result = await isLoggedIn(user);
      if (!result) {
        setUser(null);
        localStorage.removeItem('crm_user');
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
        return;
      }
    }

    checkLoginStatus();
  }, [user, location.pathname, navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {

    try {
      setIsLoading(true);

      if (!email || !password) {
        toast({
          title: 'Login Failed',
          description: 'Email and password are required.',
          variant: 'destructive',
        });
        return false;
      }

      const response = await user_login(email, password);

      // console.log('Login response:', response);

      if (response instanceof Error) {
        toast({
          title: 'Login Failed',
          description: response.message || 'Invalid email or password.',
          variant: 'destructive',
        });
        return false;
      }

      const user = response as User;
      setUser(user);
      localStorage.setItem('crm_user', JSON.stringify(user));
      return true;
    }
    catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while trying to log in.',
        variant: 'destructive',
      });
      return false;
    }
    finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
    toast({
      title: 'Logged Out',
      description: 'You have successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
