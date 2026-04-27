import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCustomAuth } from '@/lib/CustomAuthContext';

export default function ProtectedRouteCustom({ children }) {
  const { isAuthenticated, isLoadingAuth } = useCustomAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/admin/login?next=${location.pathname}`} replace />;
  }

  return children;
}