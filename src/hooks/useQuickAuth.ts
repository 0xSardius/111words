import { useState, useEffect, useCallback } from 'react';
import { sdk } from '@farcaster/frame-sdk';

interface QuickAuthUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  primaryAddress?: string;
}

interface QuickAuthState {
  isAuthenticated: boolean;
  user: QuickAuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export function useQuickAuth() {
  const [authState, setAuthState] = useState<QuickAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Initialize Quick Auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Use official Quick Auth to get user data
        const res = await sdk.quickAuth.fetch('/api/auth/me');
        
        if (res.ok) {
          const userData = await res.json();
          setAuthState({
            isAuthenticated: true,
            user: {
              fid: userData.fid,
              username: userData.username,
              displayName: userData.displayName,
              pfpUrl: userData.pfpUrl,
              primaryAddress: userData.primaryAddress,
            },
            isLoading: false,
            error: null,
          });
          
          // Signal to Farcaster that the app is ready
          sdk.actions.ready();
        } else {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Authentication failed: ${res.status}`);
        }
      } catch (error) {
        console.error('Quick Auth initialization failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
        });
      }
    };

    initializeAuth();
  }, []);

  const authenticate = useCallback(async () => {
    // With Quick Auth, authentication is automatic
    console.log('Quick Auth: Authentication is automatic');
  }, []);

  const logout = useCallback(async () => {
    // In MiniApp context, logout is handled by Farcaster client
    console.log('Quick Auth: Logout handled by Farcaster client');
  }, []);

  return {
    ...authState,
    authenticate,
    logout,
    isInMiniApp: true, // Quick Auth only works in MiniApp context
    canCreateCoins: authState.isAuthenticated,
    getUserFid: () => authState.user?.fid || null,
  };
} 