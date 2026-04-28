import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const CustomAuthContext = createContext();

export const CustomAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingAuth(false);
    }, 3000);

    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      clearTimeout(timer);
      subscription?.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthError({
        type: 'auth_check_failed',
        message: error.message
      });
    } finally {
      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const errorMsg = error.message || 'Login failed';
      setAuthError({
        type: 'login_failed',
        message: errorMsg
      });
      return { success: false, error: errorMsg };
    }
  };

  const signup = async (email, password) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      return { 
        success: true, 
        message: 'Check your email to confirm your account'
      };
    } catch (error) {
      const errorMsg = error.message || 'Signup failed';
      setAuthError({
        type: 'signup_failed',
        message: errorMsg
      });
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <CustomAuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      login,
      signup,
      logout,
      checkAuth
    }}>
      {children}
    </CustomAuthContext.Provider>
  );
};

export const useCustomAuth = () => {
  const context = useContext(CustomAuthContext);
  if (!context) {
    throw new Error('useCustomAuth must be used within CustomAuthProvider');
  }
  return context;
};