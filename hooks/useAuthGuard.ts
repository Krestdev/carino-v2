// hooks/useAuthGuard.ts
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useStore from "@/context/store";
import { toast } from "react-toastify";

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const redirectRoute = useSearchParams().get("redirect")

  // on lit Zustand
  const user = useStore((s) => s.user);
  const token = useStore((s) => s.token);
  const isHydrated = useStore((s) => s.isHydrated);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // tant que Zustand n'a pas fini sa réhydratation depuis sessionStorage,
    // on fait rien du tout
    if (!isHydrated) return;

    const isLoggedIn = Boolean(user && token);

    if (!isLoggedIn) {
      !!redirectRoute ? router.replace(decodeURIComponent(redirectRoute))
        : (router.back(), toast.error("Vous devez être connecté pour accéder à cette page"))

      return;
    }

    // si on arrive ici : on est autorisé à voir la page courante
    setReady(true);
  }, [isHydrated, pathname, router, user, token]);

  return {
    isReady: ready, // true seulement quand on peut afficher la page
    isAuthenticated: Boolean(user && token),
    user,
    token,
  };
}