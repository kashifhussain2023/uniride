import { useState, useEffect } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ApiImage component for displaying images from the API with preview functionality
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Image source path (relative to uploads directory)
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.alt - Image alt text
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.fallbackSrc - Fallback image path if the main image fails to load
 * @param {string} props.type - Image type ('car' or 'general')
 * @param {boolean} props.enablePreview - Whether to enable preview on click
 * @param {number} props.previewWidth - Width of the preview image
 * @param {number} props.previewHeight - Height of the preview image
 * @returns {JSX.Element} ApiImage component
 */
const ApiImage = ({ 
  src, 
  width, 
  height, 
  alt = 'Image', 
  className = '', 
  style = {}, 
  fallbackSrc = '/image_not_found.png',
  type = 'general',
  enablePreview = true,
  previewWidth = 800,
  previewHeight = 600
}) => {
  const [error, setError] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  // Construct the API URL based on the image type
  const getImageUrl = () => {
    if (!src) return fallbackSrc;
    
    // If src is a blob URL (preview), return it directly
    if (src.startsWith('blob:')) {
      return src;
    }
    
    if (type === 'car') {
      // For car images, use the dedicated cars endpoint
      return `/api/image/cars/${src}`;
    } else {
      // For general images, use the generic endpoint
      return `/api/image/${src}`;
    }
  };

  useEffect(() => {
    setImageUrl(error ? fallbackSrc : getImageUrl());
  }, [src, error, type]);
  
  // Handle opening and closing the preview modal
  const handleOpenPreview = () => {
    if (enablePreview) {
      setOpenPreview(true);
    }
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };
  
  return (
    <>
      <div 
        onClick={handleOpenPreview}
        style={{ 
          cursor: enablePreview ? 'pointer' : 'default',
          display: 'inline-block',
          ...style
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={className}
          onError={() => setError(true)}
        />
      </div>

     
    </>
  );
};

ApiImage.propTypes = {
  src: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  fallbackSrc: PropTypes.string,
  type: PropTypes.oneOf(['car', 'general']),
  enablePreview: PropTypes.bool,
  previewWidth: PropTypes.number,
  previewHeight: PropTypes.number
};

export default ApiImage; 