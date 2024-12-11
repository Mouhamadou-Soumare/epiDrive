export class CameraError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "CameraError";
    }
  }
  
  export class ImageCaptureError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ImageCaptureError";
    }
  }