import { useState, useEffect, useCallback } from 'react';
import { useMiniApp } from '@neynar/react';

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

  // Get MiniApp context
  const { context } = useMiniApp();

  // Initialize authentication with MiniApp context
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Check if we have MiniApp context with user
        if (context?.user) {
          console.log('MiniApp context user:', context.user);
          
          setAuthState({
            isAuthenticated: true,
            user: {
              fid: context.user.fid,
              username: context.user.username,
              displayName: context.user.displayName,
              pfpUrl: context.user.pfpUrl,
            },
            isLoading: false,
            error: null,
          });
        } else {
          // No MiniApp context available
          console.log('No MiniApp context available');
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Not running in MiniApp context',
          });
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
        });
      }
    };

    initializeAuth();
  }, [context]);

  const authenticate = useCallback(async () => {
    console.log('Auth: Authentication handled by MiniApp context');
  }, []);

  const logout = useCallback(async () => {
    console.log('Auth: Logout handled by Farcaster client');
  }, []);

  return {
    ...authState,
    authenticate,
    logout,
    isInMiniApp: !!context,
    canCreateCoins: authState.isAuthenticated,
    getUserFid: () => authState.user?.fid || null,
  };
} 