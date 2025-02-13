'use client';

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ClientFooterWrapper() {
  const pathname = usePathname();

  const noFooterRoutes = ["/auth/signin", "/auth/register", "/backoffice"];
  const shouldShowFooter = !noFooterRoutes.some((route) => pathname.startsWith(route));

  if (!shouldShowFooter) return null;

  return <Footer />;
}
