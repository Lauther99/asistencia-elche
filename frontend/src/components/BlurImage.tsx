import React, { useState } from 'react';

interface BlurImageProps {
  src: string;
  placeholderSrc: string;
  alt?: string;
  className?: string;
}

const BlurImage: React.FC<BlurImageProps> = ({
  src,
  placeholderSrc,
  alt = '',
  className = ''
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`blur-image-wrapper ${className}`}>
      <img
        src={placeholderSrc}
        alt={alt}
        className={`blur-image-placeholder ${loaded ? 'hidden' : ''}`}
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`blur-image-main ${loaded ? 'visible' : 'hidden'}`}
      />
    </div>
  );
};

export default BlurImage;
