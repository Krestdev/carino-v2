"use client";

import { ReactNode } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Loader } from "lucide-react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { isReady, isAuthenticated } = useAuthGuard();

  // 1. Tant que Zustand n'est pas hydraté OU qu'on est en train de rediriger,
  //    on évite de flasher le contenu
  if (!isReady) {
    return <div className="w-full min-h-[60vh] flex items-center justify-center py-10 sm:py-14 lg:py-20"><Loader className="animate-spin text-primary" /></div>
  }

  // 2. S'il n'est pas authentifié, le hook a déjà fait router.replace("/login")
  //    donc ici on retourne juste null.
  if (isAuthenticated) {
    return null;
  }

  // 3. rendu normal de ta zone logguée
  return children
}