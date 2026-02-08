import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex justify-center mb-4">
      <img 
        src="public/assets/logo/docvia_logo_transparent.png" 
        alt="Docvia Logo" 
        className="h-28 w-auto object-contain drop-shadow-xs"
        // Use h-16 for height, w-auto maintains aspect ratio
        // Adjust h-16 to h-20, h-24, etc. as needed
      />
    </div>
  );
};