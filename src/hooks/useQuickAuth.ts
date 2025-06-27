import { useState, useEffect, useCallback } from 'react';
import { useMiniApp } from '@neynar/react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface QuickAuthUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface QuickAuthState {
  isAuthenticated: boolean;
  user: QuickAuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export function useQuickAuth() {
  const { context } = useMiniApp();
  const { data: session, status: sessionStatus } = useSession();
  const [authState, setAuthState] = useState<QuickAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null,
  });

  // Check if we're in a MiniApp environment
  const isInMiniApp = !!context?.user;

  // Update auth state based on MiniApp context or NextAuth session
  useEffect(() => {
    if (isInMiniApp && context?.user) {
      // Use MiniApp context for auth
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
    } else if (session?.user?.fid) {
      // Fall back to NextAuth session
      setAuthState({
        isAuthenticated: true,
        user: {
          fid: session.user.fid,
          username: 'farcaster_user',
          displayName: 'Farcaster User',
          pfpUrl: '/placeholder.svg',
        },
        isLoading: false,
        error: null,
      });
    } else {
      // Not authenticated
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: sessionStatus === 'loading',
        error: null,
      });
    }
  }, [context, session, sessionStatus, isInMiniApp]);

  const authenticate = useCallback(async () => {
    if (isInMiniApp) {
      // In MiniApp, authentication is automatic via context
      // No explicit sign-in needed - user is already authenticated
      console.log('MiniApp: User already authenticated via context');
      return;
    } else {
      // Outside MiniApp, fall back to NextAuth
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        const result = await signIn('credentials', { 
          redirect: false,
          callbackUrl: '/' 
        });
        
        if (!result?.ok) {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Authentication failed'
        }));
      }
    }
  }, [isInMiniApp]);

  const logout = useCallback(async () => {
    if (isInMiniApp) {
      // In MiniApp, we can't really "log out" - it's handled by Farcaster
      console.log('MiniApp: Logout handled by Farcaster client');
      return;
    } else {
      // Outside MiniApp, use NextAuth signOut
      await signOut({ callbackUrl: '/' });
    }
  }, [isInMiniApp]);

  return {
    ...authState,
    authenticate,
    logout,
    isInMiniApp,
    // Helper methods
    canCreateCoins: authState.isAuthenticated,
    getUserFid: () => authState.user?.fid || null,
  };
} 