import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ReactNode } from "react";
import ClientSessionWrapper from "../components/ClientSessionWrapper";
import ClientNavbarWrapper from "@/components/ClientNavbarWrapper";
import ClientFooterWrapper from "@/components/ClientFooterWrapper";
import { CartProvider } from "@/context/CartContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EpiDrive",
  description: "Faites de vos courses un plaisir, alliant saveurs et praticité en un clic",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientSessionWrapper>
          <CartProvider>
            <ClientNavbarWrapper />
            {children}
            <ClientFooterWrapper />
          </CartProvider>
        </ClientSessionWrapper>
      </body>
    </html>
  );
}
