"use client";

import { motion } from "framer-motion";

const letters = "LE CARINO".split("");

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex space-x-1 text-4xl font-bold text-primary">
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
            className="font-mono"
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default Loading;
