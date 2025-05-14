import { getLoginPath, isAuthRoute, isPublicRoute } from '@/utils/routes';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the token and session data
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Special handling for verification page
  if (pathname === '/verification') {
    // Check for registration details cookie
    const registrationDetail = request.cookies.get('registrationDetail');
    if (registrationDetail) {
      return NextResponse.next();
    }
    // If no registration cookie, redirect to login
    return NextResponse.redirect(new URL(getLoginPath(), request.url));
  }

  if (isAuthRoute(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL(getLoginPath(), request.url));
    }

    try {
      // Check if we have the necessary token data
      if (!token.user?.token_code) {
        console.error('Token code missing in session');
        return NextResponse.redirect(new URL(getLoginPath(), request.url));
      }

      // Fetch profile details for protected routes
      const profileResponse = await fetch(
        `${process.env.NEW_API_URL}/customer/get-profile-details`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.user.token_code}`,
            'Content-Type': 'application/json',
            'x-login-method': 'jwt',
          },
          method: 'GET',
        }
      );

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Profile fetch failed:', {
          error: errorText,
          status: profileResponse.status,
          statusText: profileResponse.statusText,
        });
        throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();

      if (!profileData.data) {
        throw new Error('Invalid profile data received');
      }

      // Check OTP verification status
      if (profileData.data.otp_verified === 0 && pathname !== '/verification') {
        // Store current path to redirect back after verification
        const response = NextResponse.redirect(new URL('/verification', request.url));
        response.cookies.set('redirectAfterVerification', pathname);
        return response;
      }

      // Store profile data in request headers for use in the page
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-profile-data', JSON.stringify(profileData));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Middleware error details:', {
        message: error.message,
        pathname,
        stack: error.stack,
        token: token ? 'Token exists' : 'No token',
      });

      // Create response for redirect
      const response = NextResponse.redirect(new URL(getLoginPath(), request.url));

      // Clear all cookies
      const cookies = request.cookies.getAll();
      cookies.forEach(cookie => {
        response.cookies.delete(cookie.name);
      });

      // Clear any session-related cookies
      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      response.cookies.delete('registrationDetail');
      response.cookies.delete('redirectAfterVerification');

      return response;
    }
  }

  // For public routes, allow access
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
