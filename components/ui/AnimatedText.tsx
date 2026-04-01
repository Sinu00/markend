"use client";

import { motion } from "framer-motion";

type AnimatedTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

export default function AnimatedText({ text, className, delay = 0 }: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: delay + index * 0.15 }}
          className="mr-3 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
