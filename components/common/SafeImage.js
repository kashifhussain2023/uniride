import Image from 'next/image';
import { useState } from 'react';
import { dynamicImageLoader, handleImageError } from '../../utils/imageLoader';

/**
 * A safe image component that handles loading errors gracefully
 * @param {Object} props - The component props
 * @param {string|Object} props.src - The image source (URL string or object with path and filename)
 * @param {string} props.alt - The alt text for the image
 * @param {number} props.width - The width of the image
 * @param {number} props.height - The height of the image
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallbackSrc - The fallback image source
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element} - The rendered image component
 */
export default function SafeImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = '/logo1.png',
  style = {},
  ...props
}) {
  const [error, setError] = useState(false);

  // Handle image loading error
  const handleError = e => {
    setError(true);
    handleImageError(e, fallbackSrc);
  };

  // If there was an error, use the fallback image
  const imageSrc = error ? fallbackSrc : src;

  return (
    <Image
      src={imageSrc}
      alt={alt || 'Image'}
      width={width}
      height={height}
      className={className}
      style={style}
      loader={dynamicImageLoader}
      onError={handleError}
      {...props}
    />
  );
}
