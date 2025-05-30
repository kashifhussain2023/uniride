import { getDefaultAuthRedirect, getLoginPath, isAuthRoute, isPublicRoute } from '@/utils/routes';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('pathname', pathname);

  // Get the token and session data
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });
  //console.log("token", token);

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

  // Handle auth routes
  //console.log("isAuthRoute", isAuthRoute(pathname));
  if (isAuthRoute(pathname)) {
    if (!token) {
      //console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL(getLoginPath(), request.url));
    }

    try {
      // Debug token
      // console.log('Token data:', {
      //     hasToken: !!token,
      //     hasUser: !!token?.user,
      //     hasData: !!token?.user?.data,
      //     hasTokenCode: !!token?.user?.data?.token_code
      // });

      if (!token.user?.data?.token_code) {
        console.error('Token code missing in session');
        return NextResponse.redirect(new URL(getLoginPath(), request.url));
      }

      // Fetch profile details for protected routes
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

      // Debug response

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
      //console.log('Profile Data:', JSON.stringify(profileData));

      if (!profileData.data) {
        //console.error('Invalid profile data structure:', profileData);
        throw new Error('Invalid profile data received');
      }

      // Check OTP verification status
      if (profileData.data.otp_verified === 0 && pathname !== '/verification') {
        // Store current path to redirect back after verification
        const response = NextResponse.redirect(new URL('/verification', request.url));
        response.cookies.set('redirectAfterVerification', pathname);
        return response;
      }
      console.log('Profile profileData.data:', profileData.data);

      // Handle specific route requirements
      // if (pathname === '/uniride') {
      //     console.log("profileData", profileData);
      //     // Check if user needs to add payment method
      //     if (!profileData.data.default_payment_method) {
      //         console.log('Redirecting to add-card: No default payment method');
      //         return NextResponse.redirect(new URL('/cards/add', request.url));
      //     }
      // }

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

      // If the error is related to an expired or invalid token, redirect to login
      if (error.message.includes('401') || error.message.includes('403')) {
        return response;
      }

      // For other errors, redirect to error page
      return NextResponse.redirect(new URL('/error', request.url));
    }
  }

  // For public routes, if user is logged in, redirect them to the dashboard
  if (isPublicRoute(pathname)) {
    // If user is logged in, redirect to dashboard
    if (token) {
      //console.log('User is logged in, redirecting from public route to dashboard');
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
