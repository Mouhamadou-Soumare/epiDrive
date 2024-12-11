type CameraButtonProps = {
    streaming: boolean;
    onStartCamera: () => void;
    onCapture: () => void;
  };
  
  export function CameraButton({ streaming, onStartCamera, onCapture }: CameraButtonProps) {
    if (!streaming) {
      return (
        <button
          onClick={onStartCamera}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Activer la caméra
        </button>
      );
    }
  
    return (
      <button
        onClick={onCapture}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
      >
        Prendre une photo
      </button>
    );
  }