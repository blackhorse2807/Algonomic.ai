import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Signup from "./components/Signup";
import Login from "./components/Login";

import ImageBox from "./components/ImageBox";
import IconSplit from "./components/IconSplit";
import usePlatform from "./hooks/usePlatform";
import SplashScreen from "./components/ConceptAnimation";
import MainUI from "./components/MainUI";
import AnimatedTypography from './components/AnimatedTypography';
import MorphTransition from './components/MorphTransition';
import ConceptAnimation from './components/ConceptAnimation';
import { MdLogout } from "react-icons/md";

const DEFAULT_IMAGE = "/images/pexels-veeterzy-39811.jpg";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [phase, setPhase] = useState("text"); // "text", "animation", "border", "image"
  const [step, setStep] = useState(0); // 0: typography, 1: morph, 2: main UI
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const [loading, setLoading] = useState(false);
  const [magentaGlow, setMagentaGlow] = useState(false);
  const [fileId, setFileId] = useState(null);
  const platform = usePlatform();
  const [showSplash, setShowSplash] = useState(false);
  const [showImageBox, setShowImageBox] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [iconSplit, setIconSplit] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setPhase("text");
      setShowBorder(false);
      setShowImage(false);
    }
  }, [user]);

  // Phase progression with timers
  useEffect(() => {
    let timer;
    if (phase === "text") timer = setTimeout(() => setPhase("animation"), 2000);
    else if (phase === "animation") timer = setTimeout(() => { setShowBorder(true); setPhase("border"); }, 2000);
    else if (phase === "border") timer = setTimeout(() => { setShowImage(true); setPhase("image"); }, 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleTypographyComplete = () => {
    setStep(1);
    setShowSplash(true);
    const timer = setTimeout(() => {
      setShowImageBox(true);
      setTimeout(() => {
      setShowSplash(false);
        setStep(2);
      }, 500);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const handleMorphComplete = () => {
    setStep(2);
    // Show splash screen after morph transition
    setShowSplash(true);
    // Hide splash after 2 seconds
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  };

  // Handle image selection
  const handleImagePick = async () => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setLoading(true);
        setMagentaGlow(false);
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("https://algonomic-ai-1.onrender.com/api/v1/uploadFile", {
            method: "POST",
            body: formData,
          });
  
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Upload failed');
          }
  
          const data = await res.json();
  
          // Use croppedImage directly
          const base64Image = data.croppedImage;
          console.log("Base64 Image:", base64Image);
  
          setFileId(data.fileId);
          setImage(base64Image);
          setTimeout(() => setMagentaGlow(true), 300);
        } catch (e) {
          console.error('Upload error:', e);
          alert(`Upload failed: ${e.message}`);
        }
        setLoading(false);
      }
    };
    input.click();
  };
  

  // Handle icon click (first time cue)
  const handleIconClick = () => {
    setMagentaGlow(true);
    handleImagePick();
  };

  const styles = {
    objectFit: "cover",
    objectPosition: "center",
  };
  // Handle link icon
  const handleLink = () => {
    window.open("https://your-help-or-link-url.com", "_blank");
  };

  const boxSize = 340;
  const borderColor = "#8fd6f9";

  const whiteCyan = "linear-gradient(to bottom, #fff 54%, #8ee6ff 100%)";
  const redBlueCyan = "linear-gradient(180deg, #6947AD 0%, #328AC9 50%, #73D9F0 100%)";


  if (!user) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
        overflowY: "auto"
      }}>
        <div
        style={{
          width: "90%", // Responsive width
          maxWidth: "400px", // Limit the maximum width
          textAlign: "center", // Center-align content
        }}
      >
        {showLogin ? (
          <Login onLogin={() => {}} onShowSignup={() => setShowLogin(false)} />
        ) : (
          <Signup onSignup={() => setShowLogin(true)} onShowLogin={() => setShowLogin(true)} />
        )}
      </div>
      </div>
    );
  }
  

  return (
    <motion.div
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background crossfade layers */}
      <motion.div
        key="bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: (phase === "border" || phase === "image") ? 0 : 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: whiteCyan,
          zIndex: -1,
        }}
      />
      <motion.div
        key="bg-colored"
        initial={{ opacity: 0 }}
        animate={{ opacity: (phase === "border" || phase === "image") ? 1 : 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: redBlueCyan,
          zIndex: -1,
        }}
      />
      {/* Logout icon in top right */}
      <div
        style={{
          position: "absolute",
          top: "3%",
          right: "10%",
          zIndex: 100,
          display: "flex",
          alignItems: "center"
        }}
      >
        <button
          onClick={() => signOut(auth)}
          title="Logout"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 36,
            color: (phase === "border" || phase === "image") ? "#ffffff" : "#4a90e2",
            transition: "color 1s ease-in-out",
            padding: 0,
            margin: 0,
            display: "flex",
            alignItems: "center"
          }}
        >
          <MdLogout size= "1.5rem" />
        </button>
      </div>
      <AnimatePresence mode="wait" >
        {(phase === "text" || phase === "animation") && (
          <motion.div
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 , scale: 0.95}}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
          maxWidth: "600px",
          margin: "0 auto",
            }}
          >
            {phase === "text" ? (
              <AnimatedTypography onComplete={handleTypographyComplete} />
            ) : (
              <motion.div
          initial={{ opacity: 0, scale: 0.9 }} // Start slightly smaller and transparent
          animate={{ opacity: 0, scale: 1 }} // Smoothly scale up and fade in
          transition={{ duration: 1.0, ease: "easeInOut", delay: 3.0 }} // Add delay for smoother transition
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-100%, -100%)",
            width: 800,
            height: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
                  <ConceptAnimation boxed style={{ width: "100%", height: "100%" }} />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Centered border box and content for all animation/image phases */}
      {(phase === "animation" || phase === "border" || phase === "image") && (
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: boxSize,
            height: boxSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            background: "transparent", // Ensure no background color
            boxShadow: "none", // Remove any shadow
          }}
        >
          {/* Border animates in */}
          <AnimatePresence>
            {(phase === "border" || phase === "image") && (
              <motion.div
                key="border-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
                style={{
                  position: "absolute",
                  width: boxSize,
                  height: boxSize,
                  border: `7px solid ${borderColor}`,
                  background: "transparent",
                  pointerEvents: "none"
                }}
              />
            )}
          </AnimatePresence>
          {/* Animation and image crossfade inside the same box */}
          <div
            style={{
              width: boxSize -8,
              height: boxSize -8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
              boxShadow: "none",
            }}
          >
            <AnimatePresence mode="wait">
              {!showImage && (
                <motion.div
                  key="hex-animation"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "none",
                  }}
                >
                  <ConceptAnimation boxed style={{ width: "100%", height: "100%", boxShadow: "none" }} />
                </motion.div>
              )}
              {showImage && (
                <motion.div
                  key="image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center"}}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Icon below the box, bottom center of the screen */}
      {(phase === "border" || phase === "image") && (
        <div
        className="icon-container"
        style={{
          position: "fixed",
          left: window.innerWidth >= 1024 ? "50%" : "50%",
          // left: "53%",
          bottom: "15%",
          transform: "translateX(-50%)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: iconSplit ? "80px" : "20px",
          transition: "gap 0.6s ease-out",
        }}
      >
    <motion.div className="icon"
      initial={{ x: 0, opacity: 1 }}
      animate={iconSplit ? { x: -40, opacity: 1 } : { x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: "#fff",
        border: "3px solid #8fd6f9",
        borderRadius: "0%",
        width: 52,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(50,80,120,0.10)",
      }}
      onClick={handleIconClick}
    >
      <img
        src="/images/icon.png "
        alt="icon"
        style={{ width: 52, height: 52, display: "block", borderRadius: "0%", margin: 0, padding: 0, lineHeight: 0 }}
      />
    </motion.div>

    {/* <motion.div className="icon"
      initial={{ x: 0, opacity: 0 }}
      animate={iconSplit ? { x: 40, opacity: 1 } : { x: 0, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: "#fff",
        border: "2px solid #8fd6f9",
        borderRadius: "50%",
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(50,80,120,0.10)",
        cursor: "pointer",
      }}
      onClick={() => alert("Second icon clicked!")}
    >
      <img
        src="/images/Frame 6.png"
        alt="second icon"
        style={{ width: 32, height: 32, display: "block", borderRadius: "50%" }}
      />
    </motion.div> */}
  </div>
      )}

      {/* {phase === "image" && (
            <>
              <MainUI
                image={image}
                loading={loading}
                magentaGlow={magentaGlow}
                onIconClick={handleIconClick}
                fileId={fileId}
              />
              <IconSplit
                show={true}
                onDial={() => alert("Dial interface coming soon!")}
                onLink={handleLink}
              />
            </>
          )} */}
    </motion.div>
  );
}
