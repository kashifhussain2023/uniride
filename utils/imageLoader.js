/**
 * Utility for handling image loading with error handling
 * Prevents runtime errors when loading images
 */

/**
 * Get a safe image URL with fallback
 * @param {string} path - The path to the image
 * @param {string} filename - The filename of the image
 * @returns {string} - The safe image URL
 */
export function getImageUrl(path, filename) {
  // If path or filename is not provided, return a default image
  if (!path || !filename) {
    return '/avatar.png'; // Default fallback image
  }

  // Ensure path doesn't start with a slash if it's not the root
  const safePath = path.startsWith('/') ? path : `/${path}`;

  // Construct the URL
  return `${safePath}/${filename}`;
}

/**
 * Image loader for Next.js Image component
 * @param {Object} params - The parameters for the loader
 * @param {string} params.src - The source URL or object with path and filename
 * @returns {string} - The constructed URL
 */
export function dynamicImageLoader({ src }) {
  // If src is an object with path and filename
  if (typeof src === 'object' && src !== null && 'path' in src && 'filename' in src) {
    return getImageUrl(src.path, src.filename);
  }

  // If src is already a valid URL
  return src;
}

/**
 * Error handler for image loading
 * @param {Error} error - The error that occurred
 * @param {string} fallbackSrc - The fallback image source
 * @returns {string} - The fallback image source
 */
export function handleImageError(error, fallbackSrc = '/avatar.png') {
  // Log the error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Image loading error:', error);
  }

  // Return the fallback image
  return fallbackSrc;
}
