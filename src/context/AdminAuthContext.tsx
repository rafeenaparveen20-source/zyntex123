import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  lastLogin?: string | null;
  loginCount?: number;
  passwordLastChanged?: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  mustChangePassword: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; mustChangePassword?: boolean }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'zyntex_admin_token';
const USER_STORAGE_KEY = 'zyntex_admin_user';
const MUST_CHANGE_KEY = 'zyntex_admin_must_change';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(MUST_CHANGE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate existing token with server on initial app load
  const refreshAuth = useCallback(async () => {
    const currentToken = token || localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setMustChangePassword(!!data.mustChangePassword);
        localStorage.setItem(MUST_CHANGE_KEY, String(!!data.mustChangePassword));
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      } else {
        // Token invalid or expired
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(MUST_CHANGE_KEY);
      }
    } catch (err) {
      console.warn('Network issue during admin token validation:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // Secure Server-side Login
  const login = async (identifier: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: identifier.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Authentication failed. Please verify your credentials.',
        };
      }

      // Successful authentication
      const receivedToken = data.token;
      const receivedUser = data.user;
      const mustChange = !!data.mustChangePassword;

      setToken(receivedToken);
      setUser(receivedUser);
      setMustChangePassword(mustChange);

      try {
        localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(receivedUser));
        localStorage.setItem(MUST_CHANGE_KEY, String(mustChange));
      } catch {
        // Fallback to in-memory
      }

      return {
        success: true,
        mustChangePassword: mustChange,
      };
    } catch (err) {
      return {
        success: false,
        error: 'Unable to connect to the authentication server. Please check your network.',
      };
    }
  };

  // Change Password (both mandatory first login and routine updates)
  const changePassword = async (currentPassword: string, newPassword: string) => {
    const currentToken = token || localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!currentToken) {
      return { success: false, error: 'Unauthorized: Session missing. Please log in again.' };
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to update password.' };
      }

      setMustChangePassword(false);
      localStorage.setItem(MUST_CHANGE_KEY, 'false');

      // Refresh user info
      await refreshAuth();

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: 'Unable to communicate with the server. Please try again.',
      };
    }
  };

  // Logout
  const logout = async () => {
    const currentToken = token || localStorage.getItem(TOKEN_STORAGE_KEY);
    if (currentToken) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
      } catch {
        // Ignore logout network failure
      }
    }

    setToken(null);
    setUser(null);
    setMustChangePassword(false);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(MUST_CHANGE_KEY);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        mustChangePassword,
        isLoading,
        login,
        changePassword,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
