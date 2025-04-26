import { getDefaultAuthRedirect, getLoginPath, isAuthRoute, isPublicRoute } from '@/utils/routes';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });

  if (pathname === '/verification') {
    const registrationDetail = request.cookies.get('registrationDetail');
    if (registrationDetail) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(getLoginPath(), request.url));
  }

  if (isAuthRoute(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL(getLoginPath(), request.url));
    }

    try {
      if (!token.user?.data?.token_code) {
        console.error('Token code missing in session');
        return NextResponse.redirect(new URL(getLoginPath(), request.url));
      }

      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_NEW_API_URL}/customer/get-profile-details`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token.user.data.token_code}`,
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

      if (profileData.data.otp_verified === 0 && pathname !== '/verification') {
        const response = NextResponse.redirect(new URL('/verification', request.url));
        response.cookies.set('redirectAfterVerification', pathname);
        return response;
      }

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

      const response = NextResponse.redirect(new URL(getLoginPath(), request.url));

      const cookies = request.cookies.getAll();
      cookies.forEach(cookie => {
        response.cookies.delete(cookie.name);
      });

      response.cookies.delete('next-auth.session-token');
      response.cookies.delete('next-auth.callback-url');
      response.cookies.delete('next-auth.csrf-token');
      response.cookies.delete('registrationDetail');
      response.cookies.delete('redirectAfterVerification');

      if (error.message.includes('401') || error.message.includes('403')) {
        return response;
      }

      return NextResponse.redirect(new URL('/error', request.url));
    }
  }

  if (isPublicRoute(pathname)) {
    if (token) {
      return NextResponse.redirect(new URL(getDefaultAuthRedirect(), request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
