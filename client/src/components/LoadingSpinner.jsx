import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    </div>
  );
};

export default LoadingSpinner;
