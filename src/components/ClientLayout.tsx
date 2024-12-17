"use client";

import { SessionProvider } from "next-auth/react";
import ClientNavbarWrapper from "@/components/ClientNavbarWrapper";
import ClientFooterWrapper from "@/components/ClientFooterWrapper";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ClientNavbarWrapper />
      {children}
      <ClientFooterWrapper />
    </SessionProvider>
  );
}
