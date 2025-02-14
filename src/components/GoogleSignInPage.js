import React from "react";
import { auth } from "../services/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const GoogleSignInPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Welcome, ${user.displayName || "User"}!`);
      navigate("/"); // Redirect to Profile page after successful login
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Sign In with Google</h2>
      <button onClick={handleGoogleSignIn} style={{ backgroundColor: "#DB4437", color: "#fff", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
        Sign In with Google
      </button>
    </div>
  );
};

export default GoogleSignInPage;
