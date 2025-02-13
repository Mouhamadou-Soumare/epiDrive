"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/navbar";
import LoadingSpinner from "./components/LoadingSpinner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      setIsRedirecting(true);
      router.replace("/"); 
    }
  }, [session, status, router]);

  if (status === "loading" || isRedirecting) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="lg:pl-72 m-4">{children}</main>
    </div>
  );
}
