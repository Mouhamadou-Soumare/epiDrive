// src/components/LoadingSpinner.tsx
export default function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative">
          {/* Cercle externe */}
          <div className="animate-spin-slow rounded-full h-24 w-24 border-t-4 border-b-4 border-white"></div>
          {/* Cercle interne */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-ping-slow rounded-full h-12 w-12 bg-blue-500"></div>
          </div>
          {/* Point lumineux */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-4 w-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }
  