import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isAuthRoute, isPublicRoute, getDefaultAuthRedirect, getLoginPath } from '@/utils/routes';
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log('pathname', pathname);

  // Get the token and session data
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log('token', token);
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
  console.log('isAuthRoute', isAuthRoute(pathname));
  if (isAuthRoute(pathname)) {
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL(getLoginPath(), request.url));
    }
    try {
      // Debug token
      console.log('Token data:', {
        hasData: !!token?.user?.data,
        hasToken: !!token,
        hasTokenCode: !!token?.user?.data?.token_code,
        hasUser: !!token?.user,
      });
      if (!token.user?.data?.token_code) {
        console.error('Token code missing in session');
        return NextResponse.redirect(new URL(getLoginPath(), request.url));
      }

      // Fetch profile details for protected routes
      const profileResponse = await fetch(
        `${process.env.NEW_API_URL}/customer/get-profile-details`,
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
      console.log('Profile Response Status:', profileResponse.status);
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
      console.log('Profile Data:', JSON.stringify(profileData));
      if (!profileData.data) {
        console.error('Invalid profile data structure:', profileData);
        throw new Error('Invalid profile data received');
      }

      // Check OTP verification status
      if (profileData.data.otp_verified === 0 && pathname !== '/verification') {
        // Store current path to redirect back after verification
        const response = NextResponse.redirect(new URL('/verification', request.url));
        response.cookies.set('redirectAfterVerification', pathname);
        return response;
      }

      // Handle specific route requirements
      // if (pathname === '/uniride') {
      //     console.log("profileData", profileData);
      //     // Check if user needs to add payment method
      //     if (!profileData.data.default_payment_method) {
      //         console.log('Redirecting to add-card: No default payment method');
      //         return NextResponse.redirect(new URL('/add-card', request.url));
      //     }

      //     // Check if corporate profile is verified
      //     if (!profileData.data.corporate_profile_verified) {
      //         console.log('Redirecting to corporate-verification: Profile not verified');
      //         return NextResponse.redirect(new URL('/corporate-verification', request.url));
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

      // If the error is related to an expired or invalid token, redirect to login
      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.redirect(new URL(getLoginPath(), request.url));
      }

      // For other errors, redirect to error page
      return NextResponse.redirect(new URL('/error', request.url));
    }
  }

  // For public routes, if user is logged in and trying to access login/register pages,
  // redirect them to the dashboard
  if (isPublicRoute(pathname)) {
    // If user is logged in and trying to access auth pages
    if (token) {
      // Check if OTP is verified for logged-in users
      try {
        const profileResponse = await fetch(
          `${process.env.NEW_API_URL}/customer/get-profile-details`,
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
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();

          // If OTP is not verified, redirect to verification
          if (profileData.data.otp_verified === 0 && pathname !== '/verification') {
            return NextResponse.redirect(new URL('/verification', request.url));
          }
        }
      } catch (error) {
        console.error('Error checking OTP verification:', error);
      }

      // If trying to access login/register pages and OTP is verified
      if (['/login', '/register'].includes(pathname)) {
        return NextResponse.redirect(new URL(getDefaultAuthRedirect(), request.url));
      }
    }
    return NextResponse.next();
  }

  // Allow all other routes
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
