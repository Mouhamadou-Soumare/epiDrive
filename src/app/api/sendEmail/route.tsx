// app/api/sendEmail/route.tsx

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialisation de Resend avec l'API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { subject, message } = await req.json();
    console.log('Payload reçu:', { subject, message });

    // Récupération des informations depuis les variables d'environnement
    const recipientEmail = process.env.RESEND_EMAIL_TO;
    const senderEmail = process.env.RESEND_EMAIL_FROM;

    if (!recipientEmail || !senderEmail) {
      throw new Error(
        "Les adresses email de destination (RESEND_EMAIL_TO) et d'expédition (RESEND_EMAIL_FROM) doivent être définies dans le fichier .env."
      );
    }

    // Envoi de l'email via Resend
    const { data, error } = await resend.emails.send({
      from: senderEmail, // Utilisation de votre domaine vérifié
      to: [recipientEmail],
      subject,
      html: `<div><h1>${message}</h1></div>`,
    });

    console.log('Réponse Resend:', { data, error });

    if (error) {
      console.error('Erreur Resend:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email.' },
      { status: 500 }
    );
  }
}
