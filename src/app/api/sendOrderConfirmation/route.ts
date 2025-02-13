import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie un email de confirmation de commande
 */
export async function POST(req: Request) {
  try {
    const { userName, commandeId, email } = await req.json();

    console.log("Payload reçu:", { userName, commandeId, email });

    // Validation des paramètres requis
    if (!userName || !commandeId || !email) {
      return NextResponse.json(
        {
          error:
            "Les informations de l'utilisateur ou de la commande sont manquantes.",
        },
        { status: 400 }
      );
    }

    const senderEmail = process.env.RESEND_EMAIL_FROM;
    if (!senderEmail) {
      return NextResponse.json(
        {
          error:
            "L'adresse email d'expédition (RESEND_EMAIL_FROM) doit être définie dans le fichier .env.",
        },
        { status: 500 }
      );
    }

    // Modèle HTML de l'email de confirmation
    const htmlTemplate = `
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation de votre commande</title>
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
          <div class="email-header">
            <img src="https://i.ibb.co/60wtMXPw/epidrive-logo-bg-remove.png" alt="Logo">
          </div>
          <img class="hero-image" src="https://alliantech.com/img/notif/Onboarding.jpg" alt="Hero Image">
          <div class="email-body">
            <h1>Bonjour ${userName},</h1>
            <p>Nous avons bien reçu votre commande <span class="highlight">#${commandeId}</span>.</p>
            <p>Merci de nous faire confiance ! Vous pouvez suivre votre commande en vous connectant à votre espace client.</p>
            <p>À bientôt !<br>L'équipe epiDrive</p>
          </div>
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
      .replace("{{commandeId}}", commandeId)
      .replace("{{userName}}", userName);

    // Envoi de l'email avec Resend
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [email],
      subject: `Confirmation de votre commande #${commandeId}`,
      html: filledTemplate,
    });

    console.log("Réponse Resend:", { data, error });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email." },
      { status: 500 }
    );
  }
}
