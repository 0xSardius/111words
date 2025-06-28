import { NextRequest, NextResponse } from 'next/server';

// For now, we'll implement a simple validation
// In production, you'd use @farcaster/quick-auth for proper JWT validation
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
    
    // TODO: Replace with proper JWT validation using @farcaster/quick-auth
    // For now, we'll mock the response to get the flow working
    // This is just for development - you MUST implement proper validation for production
    
    // Mock user data - in production this would come from JWT payload
    const mockUser = {
      fid: 12345,
      username: 'writer',
      displayName: 'Daily Writer',
      pfpUrl: '/icon.png',
      primaryAddress: '0x1234567890123456789012345678901234567890'
    };

    return NextResponse.json(mockUser);
    
  } catch (error) {
    console.error('Auth validation error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 