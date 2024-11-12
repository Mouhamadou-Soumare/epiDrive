import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import FormData from 'form-data';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const binaryImage = Buffer.from(base64Image, 'base64');

    const formData = new FormData();
    formData.append('image', binaryImage, {
      filename: 'image.png',
      contentType: 'image/png',
    });

    const response = await fetch('https://vision.foodvisor.io/api/1.0/en/analysis/', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${process.env.FOODVISOR_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();

    console.log('Réponse complète de l\'API:', JSON.stringify(data, null, 2));

    if (!response.ok || !data.items) {
      console.error('Response error details:', data);
      throw new Error(data.detail || 'Erreur inconnue');
    }

    const detectedDish = data.items[0]?.food[0]?.food_info.display_name || 'Plat inconnu';

    const ingredients = data.items.flatMap((item: any) => {
      return item.food.flatMap((foodItem: any) => {
        return foodItem.ingredients?.length > 0
          ? foodItem.ingredients.map((ingredient: any) => ({
              name: ingredient.food_info.display_name,
              quantity: ingredient.quantity,
            }))
          : [{
              name: foodItem.food_info.display_name,
              quantity: foodItem.quantity,
            }];
      });
    }) || [];

    return NextResponse.json({ dish: detectedDish, ingredients });
  } catch (error: any) {
    console.error('Erreur lors de l\'analyse de l\'image:', error.message || error);
    return NextResponse.json({ error: 'Erreur lors de l\'analyse de l\'image' }, { status: 500 });
  }
}
