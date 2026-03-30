import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.article
      className={className ? `card ${className}` : "card"}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      {children}
    </motion.article>
  );
}

