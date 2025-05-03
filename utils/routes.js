/**
 * Routes configuration for the application
 */

// Routes that require authentication
export const authRoutes = {
  addCard: '/cards/add',
  corporateVerification: '/corporate-verification',
  designatedDriver: '/designated-driver',
  profile: '/profile',
  riderHistory: '/rider-history',
  rides: '/rides',
  settings: '/settings',
  uniride: '/uniride',
};

// Public routes (including login/register pages)
export const publicRoutes = {
  about: '/about',
  contact: '/contact',
  forgotPassword: '/forgot-password',
  home: '/',
  login: '/login',
  privacy: '/privacy',
  register: '/register',
  resetPassword: '/reset-password',
  terms: '/terms',
  verification: '/verification',
};

// Route groups for middleware checks
export const routeGroups = {
  // Routes that require authentication
  auth: Object.values(authRoutes),
  // Routes that are publicly accessible
  public: Object.values(publicRoutes),
};

/**
 * Check if a route requires authentication
 * @param {string} pathname - The current pathname
 * @returns {boolean}
 */
export const isAuthRoute = pathname => {
  return routeGroups.auth.includes(pathname);
};

/**
 * Check if a route is public
 * @param {string} pathname - The current pathname
 * @returns {boolean}
 */
export const isPublicRoute = pathname => {
  return routeGroups.public.includes(pathname);
};

/**
 * Get the default redirect path after login
 * @returns {string}
 */
export const getDefaultAuthRedirect = () => {
  return authRoutes.uniride;
};

/**
 * Get the login path
 * @returns {string}
 */
export const getLoginPath = () => {
  return publicRoutes.login;
};
