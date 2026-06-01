"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const Loading = () => {
  const [progress, setProgress] = useState(0);
  const text = "LE CARINO PIZZERIA";
  const letters = text.split("");
  const containerRef = useRef(null);
  const [letterWidths, setLetterWidths] = useState<number[]>([]);

  useEffect(() => {
    if (containerRef.current as any) {
      const spans = (containerRef.current as any).children;
      const widths = Array.from(spans).map((span: any) => span.offsetWidth);
      setLetterWidths(widths);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return text.length;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [text.length]);

  // Calculer la position de la pizza
  const getPizzaPosition = () => {
    if (letterWidths.length === 0 || progress === 0) return 0;

    let position = 0;
    for (let i = 0; i < progress && i < letterWidths.length; i++) {
      position += letterWidths[i];
      if (i < progress - 1) position += 3;
    }
    return position;
  };

  return (
    <div className="fixed inset-0 bg-amber-50 flex flex-col justify-center items-center z-50">
      <div className="relative">
        {/* Conteneur du texte */}
        <div
          ref={containerRef}
          className="flex space-x-1 mb-8"
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el && letterWidths.length === 0) {
                  // Largeur initiale
                }
              }}
              className={`font-mono text-2xl md:text-4xl font-bold transition-all duration-300 ${index < progress ? "text-primary" : "text-gray-300"
                }`}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </div>

        {/* Pizza qui survole le texte */}
        <motion.div
          className="absolute -top-12 left-0"
          animate={{
            x: getPizzaPosition(),
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="text-4xl md:text-5xl animate-bounce">🍕</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Loading;