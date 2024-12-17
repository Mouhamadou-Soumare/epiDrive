"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function ClientNavbarWrapper() {
  const pathname = usePathname();

  // Routes qui n'affichent pas la Navbar
  const noNavbarRoutes = ["/auth/signin", "/auth/register", "/backoffice"];

  const shouldShowNavbar = noNavbarRoutes.every((route) => !pathname.startsWith(route));

  if (!shouldShowNavbar) return null;

  return <Navbar />;
}
