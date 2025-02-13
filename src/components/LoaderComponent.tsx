import React from 'react';

/**
 * Composant Loader générique pour afficher un indicateur de chargement centré.
 */
const LoaderComponent = () => {
  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center">
      <span className="loader-cate-prod"></span>
    </div>
  );
};

export default LoaderComponent;
