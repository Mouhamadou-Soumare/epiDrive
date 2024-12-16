// src/components/ClientFooterWrapper.tsx

'use client';

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ClientFooterWrapper() {
  const pathname = usePathname();

  // Define routes where the footer should not appear
  const noFooterRoutes = ["/auth/signin", "/auth/register", "/backoffice"];
  const shouldShowFooter = !noFooterRoutes.some((route) => pathname.startsWith(route));

  // If the current path matches any excluded routes, return null
  if (!shouldShowFooter) return null;

  return <Footer />;
}
