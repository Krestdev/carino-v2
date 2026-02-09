"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Promotion } from "@/types/types";

interface Props {
  promotions: Promotion[];
  fallbackHref?: string; // si promo.href est vide
  repeatCount?: number;  // nb de répétitions du message
}

function pickActivePromotion(promotions: Promotion[]) {
  const actives = promotions.filter((p) => {
    try {
      return p.isActive?.() ?? false;
    } catch {
      return false;
    }
  });

  // priorité la plus élevée = plus petit nombre (comme CSS z-index inverse)
  // si chez toi c’est l’inverse, remplace par b.priority - a.priority
  actives.sort((a, b) => a.priority - b.priority);

  return actives[0] ?? null;
}

const PromoMessage = ({
  promotions,
  fallbackHref = "/catalogue/253199",
  repeatCount = 12,
}: Props) => {
  const reduceMotion = useReducedMotion();

  const promo = useMemo(() => pickActivePromotion(promotions), [promotions]);

  if (!promo) return null;

  const href = promo.href ?? fallbackHref;

  // Motion: si l’utilisateur préfère réduire les animations, on affiche statique
  if (reduceMotion) {
    return (
      <div className="w-full bg-[#29235C] h-[80px] flex items-center border-t border-white px-6">
        <Link href={href} className="w-full">
          <p className="text-[#FFC336] text-lg md:text-[28px] truncate">
            {promo.message}
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <Link
        href={href}
        className="relative w-full overflow-hidden bg-[#29235C] h-[80px] flex items-center border-t border-white"
        aria-label={promo.name}
      >
        {/* Deux lignes identiques pour un défilement continu sans “trou” */}
        <motion.div
          className="flex whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 120, // ajuste la vitesse (35s = fluide)
            ease: "linear",
          }}
        >
          {[...Array(2)].map((_, blockIdx) => (
            <div key={blockIdx} className="flex">
              {Array.from({ length: repeatCount }).map((_, i) => (
                <span
                  key={`${blockIdx}-${i}`}
                  className="font-normal text-[18px] md:text-[28px] text-[#FFC336] mr-20"
                >
                  {promo.message}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </Link>
    </div>
  );
};

export default PromoMessage;
