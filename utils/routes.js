/**
 * Routes configuration for the application
 */

// Routes that require authentication
export const authRoutes = {
    uniride: '/uniride',
    addCard: '/add-card',
    profile: '/profile',
    rides: '/rides',
    settings: '/settings',
    corporateVerification: '/corporate-verification'
};

// Public routes (including login/register pages)
export const publicRoutes = {
    home: '/',
    login: '/login',
    register: '/register',
    verification: '/verification',
    about: '/about',
    contact: '/contact',
    terms: '/terms',
    privacy: '/privacy',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password'
};

// Route groups for middleware checks
export const routeGroups = {
    // Routes that require authentication
    auth: Object.values(authRoutes),
    // Routes that are publicly accessible
    public: Object.values(publicRoutes)
};

/**
 * Check if a route requires authentication
 * @param {string} pathname - The current pathname
 * @returns {boolean}
 */
export const isAuthRoute = (pathname) => {
    return routeGroups.auth.includes(pathname);
};

/**
 * Check if a route is public
 * @param {string} pathname - The current pathname
 * @returns {boolean}
 */
export const isPublicRoute = (pathname) => {
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