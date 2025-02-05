// app/api/sendEmail/route.tsx

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialisation de Resend avec l'API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { subject, message, userName, commandeId } = await req.json();

    console.log('Payload reçu:', { subject, message, userName, commandeId });

    // Récupération des informations depuis les variables d'environnement
    const recipientEmail = process.env.RESEND_EMAIL_TO;
    const senderEmail = process.env.RESEND_EMAIL_FROM;

    if (!recipientEmail || !senderEmail) {
      throw new Error(
        "Les adresses email de destination (RESEND_EMAIL_TO) et d'expédition (RESEND_EMAIL_FROM) doivent être définies dans le fichier .env."
      );
    }

    const htmlTemplate = `
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Notification de statut de commande</title>
        <style type="text/css">
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f4f6;
            color: #000;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            text-align: center;
          }
          .email-container {
            width: 600px;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background-color: #003347;
            color: white;
            padding: 20px;
          }
          .email-header img {
            width: 150px;
            max-width: 150px;
            display: block;
            margin: 0 auto;
          }
          .hero-image {
            width: 100%;
            max-width: 600px;
            height: auto;
            display: block;
            margin: 0 auto;
          }
          .email-body {
            padding: 20px;
            text-align: left;
          }
          .email-body h1 {
            font-size: 22px;
            margin-bottom: 10px;
            color: #003347;
          }
          .email-body p {
            font-size: 15px;
            line-height: 24px;
            color: #333333;
          }
          .email-body .highlight {
            font-weight: bold;
            color: #003347;
          }
          .email-footer {
            background-color: #003347;
            color: white;
            padding: 15px;
            font-size: 12px;
            text-align: center;
          }
          .email-footer a {
            color: #ffffff;
            text-decoration: none;
          }
          .footer-logo {
            margin-top: 10px;
          }
          .footer-logo img {
            width: 120px;
            height: 120px;
            display: block;
            margin: 5px auto 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header Section -->
          <div class="email-header">
            <img src="https://i.ibb.co/60wtMXPw/epidrive-logo-bg-remove.png" alt="Logo">
          </div>
    
          <!-- Hero Image Section -->
          <img class="hero-image" src="https://alliantech.com/img/notif/Onboarding.jpg" alt="Hero Image">
    
          <!-- Email Body Section -->
          <div class="email-body">
            <h1>Bonjour {{userName}},</h1>
            <p>Le statut de votre commande <span class="highlight">#{{commandeId}}</span> a été mis à jour.</p>
            <p><span class="highlight">{{statutCommande}} </span></p>
            <p>Vous pouvez consulter le suivi de votre commande en vous connectant à votre espace client.</p>
            <p>Merci de nous faire confiance.<br>L'équipe epiDrive</p>
          </div>
    
          <!-- Footer Section -->
          <div class="email-footer">
            <p>2 place de la Bourse, 75002 PARIS</p>
            <p><a href="https://www.epidrive.com">www.epidrive.com</a></p>
            <div class="footer-logo">
              <img src="https://i.imghippo.com/files/ZBS6878jAE.png" alt="epiDrive Logo">
            </div>
          </div>
        </div>
      </body>
    </html>
    `;
    
    

    const filledTemplate = htmlTemplate

    .replace('{{commandeId}}', commandeId)

    .replace('{{statutCommande}}', message)

    .replace('{{userName}}', userName);



    // Envoi de l'email via Resend
    const { data, error } = await resend.emails.send({
      from: senderEmail, // Utilisation de votre domaine vérifié
      to: [recipientEmail],
      subject: `Mise à jour de la commande #${commandeId}`,
      html: filledTemplate,
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
