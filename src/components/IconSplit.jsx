import { motion } from "framer-motion";

export default function IconSplit({ onDial, onLink, show }) {
  if (!show) return null;
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 flex gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: "-50%" }}
      transition={{ duration: 0.7 }}
      style={{ transform: "translateX(-50%)" }}
    >
      <motion.button
        className="w-16 h-16 bg-white rounded-full border-4 border-cyan-400 flex items-center justify-center shadow-lg"
        whileTap={{ scale: 0.9 }}
        onClick={onDial}
        aria-label="Open dial"
      >
        <span role="img" aria-label="dial" className="text-2xl text-cyan-700">🎛️</span>
      </motion.button>
      <motion.button
        className="w-16 h-16 bg-white rounded-full border-4 border-pink-400 flex items-center justify-center shadow-lg"
        whileTap={{ scale: 0.9 }}
        onClick={onLink}
        aria-label="Help or Link"
      >
        <span role="img" aria-label="link" className="text-2xl text-pink-700">🔗</span>
      </motion.button>
    </motion.div>
  );
}