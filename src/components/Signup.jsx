import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Signup({ onSignup, onShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignup && onSignup();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
    }}>
      <form onSubmit={handleSignup} style={{
        minWidth: 320,
        maxWidth: 380,
        width: "100%",
        background: "#fff",
        padding: 32,
        borderRadius: 18,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h2 style={{ marginBottom: 18, color: "#4a90e2", fontWeight: 600, fontSize: 28 }}>Sign Up</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required style={{
          width: "100%",
          padding: "12px 16px",
          marginBottom: 14,
          borderRadius: 8,
          border: "1px solid #e0e7ef",
          fontSize: 16
        }} />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required style={{
          width: "100%",
          padding: "12px 16px",
          marginBottom: 18,
          borderRadius: 8,
          border: "1px solid #e0e7ef",
          fontSize: 16
        }} />
        <button type="submit" style={{
          width: "100%",
          padding: "12px 0",
          background: "linear-gradient(90deg, #4a90e2 0%, #50e3c2 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 18,
          cursor: "pointer",
          marginBottom: 8,
          boxShadow: "0 2px 8px #4a90e233"
        }}>Sign Up</button>
        <div style={{
          marginTop: 18,
          width: "100%",
          textAlign: "center",
          borderTop: "1px solid #e0e7ef",
          paddingTop: 12,
          fontSize: 15
        }}>
          <span>Already have an account? </span>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "#4a90e2",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 15
            }}
            onClick={onShowLogin}
          >
            Login
          </button>
        </div>
        {error && <div style={{ color: "#e74c3c", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
} 