import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    const API_KEY = process.env.CHATGPT_API_KEY;

    if (!API_KEY) {
      throw new Error('API key is missing');
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    console.log('Analyse de l\'image en cours...');

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
          {
            role: "system",
            content: "Vous êtes un assistant utile pour l'analyse des recettes."
          },
          {
            role: 'user',
            content: [
              {
                type: "text",
                text: 'Donne moi le nom, la description, les instructions et l\'image de la recette ainsi que la liste des ingrédients pour la recette suivante (chaque ingrédient doit avoir un name, une description, un prix, une categorie) :'
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: 'plat',
            strict: true,
            schema: {
              type: "object",
              properties: {
                ingredients: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      prix: { type: "number" },
                      categorie: { type: "string" }
                    },
                    required: ["name", "description", "prix", "categorie"],
                    additionalProperties: false
                  }
                },
                title: { type: "string" },
                description: { type: "string" },
                instructions: { type: "string" },
                image: { type: "string" }
              },
              required: ["ingredients", "title", "description", "instructions", "image"],
              additionalProperties: false
            }
          }
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erreur API OpenAI:', data);
      return NextResponse.json({ error: data.error || 'Erreur lors de la requête à OpenAI' }, { status: response.status });
    }

    const content = data.choices[0]?.message?.content;
    console.log('Content de l\'API OpenAI:', content);

    if (!content) {
      return NextResponse.json({ error: 'Aucune recette trouvée' }, { status: 404 });
    }

    // Vous pouvez modifier ici le parsing en fonction du format de la réponse de l'API
    const parsedContent = JSON.parse(content);

    return NextResponse.json({ dish: parsedContent, ingredients: parsedContent.ingredients });
  } catch (error) {
    console.error('Erreur lors de l\'analyse de l\'image:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Erreur lors de l\'analyse de l\'image' }, { status: 500 });
  }
}
