// import React, { useState } from "react";
// import { auth } from "../services/firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { Link, useNavigate } from "react-router-dom";

// const SignInPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSignIn = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       alert("Login successful!");
//       navigate("/"); // Redirect to Profile page after login
//     } catch (error) {
//       console.error("Login Error:", error.message);
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Sign In</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleSignIn}>Sign In</button>
//       <p>
//         Don't have an account? <Link to="/signup">Sign Up</Link>
//       </p>
//       <p>
//         Or sign in with <Link to="/signin-google">Google</Link>
//       </p>
//     </div>
//   );
// };

// export default SignInPage;


import React, { useState } from "react";
import { auth } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignInPage.css"; // Include the updated CSS

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/"); // Redirect to Profile page after login
    } catch (error) {
      console.error("Login Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleSignIn} className="signin-button">
        Sign In
      </button>
      <p>
        Don't have an account? <Link to="/signup" className="link">Sign Up</Link>
      </p>
      <p className="google-signin">
        Or sign in with
        <Link to="/signin-google" className="google-link">
          <span className="google-icon"></span> Google
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
