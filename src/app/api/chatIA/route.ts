import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    // Ajout d'une structure de réponse bien définie
    const prompt = `Tu es un assistant expert en cuisine. Tu est utilisé en tant que chat dans un drive alimentaire afin de répondre à des questions des utilisateur de l'application. Réponds uniquement en français et donne des conseils de cuisine précis. Je veux que tu me renvoie uniquement la réponse à la question.
        
        FORMATS STRICT :
        - Ne pas inclure l'introduction.

        Voici ce que je veux que tu me renvoies :

        Question de l'utilisateur :
        "${message}"

        [Réponse] :
        `;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Erreur API: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    let reply = data[0]?.generated_text || "Réponse non disponible";

    console.log("Réponse:", reply);
    // Extraction : Supprimer tout ce qui précède "[Réponse] :"
    const cleanReply = reply.split("[Réponse] :")[1]?.trim() || reply;

    return NextResponse.json({ reply: cleanReply });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la requête" },
      { status: 500 }
    );
  }
}
