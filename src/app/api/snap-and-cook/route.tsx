import { NextRequest, NextResponse } from "next/server";
import * as tf from "@tensorflow/tfjs-node"; // Utilisation de tfjs-node pour le backend
import sharp from "sharp";

const MODEL_URL =
  "https://raw.githubusercontent.com/Hyuto/yolov5-tfjs/master/public/yolov5n_web_model/model.json";

let model: tf.GraphModel | null = null;

// Charger le modèle YOLOv5
const loadModel = async (): Promise<tf.GraphModel> => {
  if (!model) {
    console.log("Chargement du modèle YOLO...");
    model = await tf.loadGraphModel(MODEL_URL);
    console.log("Modèle YOLO chargé.");
  }
  return model;
};

// Prétraiter l'image
const processImage = async (imageBuffer: Buffer): Promise<tf.Tensor> => {
  try {
    // Redimensionner l'image à 640x640 et obtenir un tableau de pixels
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(640, 640, { fit: "contain" })
      .raw() // Données brutes au format RGB
      .toBuffer();

    // Convertir les données brutes en tenseur avec la forme attendue (1, 640, 640, 3)
    const imageTensor = tf.tensor(
      new Uint8Array(resizedImageBuffer),
      [640, 640, 3]
    )
      .expandDims(0) // Ajouter une dimension pour le batch
      .toFloat()
      .div(tf.scalar(255)); // Normaliser entre 0 et 1

    return imageTensor;
  } catch (error) {
    throw new Error("Erreur lors du prétraitement de l'image : " + (error as Error).message);
  }
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Image manquante dans la requête" }, { status: 400 });
    }

    // Décoder l'image base64
    const base64Image = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Charger le modèle et traiter l'image
    const model = await loadModel();
    const imageTensor = await processImage(imageBuffer);

    // Faire une prédiction
    const predictions = (model.predict(imageTensor) as tf.Tensor).arraySync() as number[][];

    // Traiter les prédictions
    const detectedLabels = predictions.map(([x, y, w, h, confidence, classId], index) => ({
      label: `Label_${classId}`,
      confidence: confidence.toFixed(2),
      bbox: { x, y, w, h },
    }));

    // Nettoyer les ressources TensorFlow
    tf.dispose(imageTensor);

    return NextResponse.json({ detectedLabels }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'analyse de l'image :", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse de l'image. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
