// Updated AnimatedTypography.jsx with animation and onComplete callback
import React, { useEffect } from "react";
import { motion } from "framer-motion";

function AnimatedTypography({ onComplete }) {
  useEffect(() => {
    // Trigger onComplete after animation duration (reduced from 3s to 1.5s)
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "linear-gradient(to bottom, #fff 50%, #7eefff 100%)",
        paddingTop: "80px",
        boxSizing: "border-box",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        style={{
          color: "#a17ee4",
          fontFamily: "'Montserrat', 'Arial', sans-serif",
          fontWeight: 200,
          fontSize: "2.2rem",
          letterSpacing: "1px",
          textAlign: "center",
          lineHeight: 1.2,
        }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          delay: 0.2,
          duration: 0.8,
          ease: "easeOut"
        }}
      >
        style<br />
        your<br />
        picture!
      </motion.div>
    </motion.div>
  );
}

export default AnimatedTypography;
