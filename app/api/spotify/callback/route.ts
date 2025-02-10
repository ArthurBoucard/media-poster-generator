import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import querystring from 'querystring';

const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;

interface TokenData {
  access_token: string;
  refresh_token: string;
  error?: string;
  error_description?: string;
}
  

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    body: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenResponse.json() as TokenData;

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
  }

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;

  const response = NextResponse.redirect(new URL('/app/spotify', request.url));
  response.cookies.set('spotify_access_token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  response.cookies.set('spotify_refresh_token', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  return response;
}
