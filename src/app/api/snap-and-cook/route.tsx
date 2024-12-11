import { NextResponse } from 'next/server';
import { ImageAnalyzer } from '../../../lib/image-analysis';
export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    // Créer un élément image pour l'analyse
    const img = new Image();
    img.src = image;
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    const result = await ImageAnalyzer.analyzeImage(img);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur lors de l\'analyse:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'analyse de l\'image' },
      { status: 500 }
    );
  }
}