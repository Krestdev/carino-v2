"use client";

import { motion } from "framer-motion";

const Loading = () => {
  const letters = "LE  CARINO  PIZZERIA".split("");
  return (
    <div className="fixed inset-0 bg-amber-50 flex flex-col justify-center items-center z-50">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="text-8xl">🍕</div>
      </motion.div>

      <div className="mt-8 flex space-x-1">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.1,
            }}
            className="font-mono text-2xl md:text-4xl text-gray-800"
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default Loading;
