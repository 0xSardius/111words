import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@farcaster/quick-auth';

// Initialize Quick Auth client
const quickAuthClient = createClient();

// Helper function to get user data from Neynar
async function getUserFromNeynar(fid: number) {
  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'api_key': process.env.NEYNAR_API_KEY || '',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Neynar API failed: ${response.status}`);
    }
    
    const data = await response.json();
    const user = data.users?.[0];
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
      primaryAddress: user.verified_addresses?.eth_addresses?.[0] || null,
    };
  } catch (error) {
    console.error('Failed to fetch user from Neynar:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authorization.split(' ')[1];
    
    // Validate JWT token using Quick Auth
    const payload = await quickAuthClient.verifyJwt({
      token,
      domain: process.env.NEXT_PUBLIC_URL || 'https://111words.vercel.app',
    });
    
    // Get FID from JWT payload
    if (!payload.sub) {
      throw new Error('No FID in token');
    }
    
    const fid = parseInt(payload.sub);
    
    if (!fid || isNaN(fid)) {
      throw new Error('Invalid FID in token');
    }
    
    // Fetch real user data from Neynar
    const userData = await getUserFromNeynar(fid);
    
    return NextResponse.json(userData);
    
  } catch (error) {
    console.error('Auth validation error:', error);
    
    // Provide specific error messages for debugging
    if (error instanceof Error) {
      if (error.message.includes('Invalid token')) {
        return NextResponse.json(
          { error: 'Invalid authentication token' },
          { status: 401 }
        );
      }
      if (error.message.includes('Neynar')) {
        return NextResponse.json(
          { error: 'Failed to fetch user data' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 