// app/api/sendEmail/route.tsx

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

console.log('process.env.RESEND_API_KEY', process.env.RESEND_API_KEY);
console.log("testttttt");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { subject, message } = await req.json();
    console.log('Payload reçu:', { subject, message });

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["choeurtis.tchounga@gmail.com"],
      subject,
      html: `<div><h1>${message}!</h1></div>`,
    });

    console.log('Réponse Resend:', { data, error });

    if (error) {
      console.error('Erreur Resend:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.log('teeeeeeeeee');
    console.error('Erreur lors de l\'envoi de l\'email: pppppppppppp', error);
    return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email tessssssssss' }, { status: 500 });
  }
}

