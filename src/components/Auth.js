import React, { useState } from "react";
import { auth } from "../services/firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const Auth = ({ onUserAuthenticated }) => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");

  const sendOTP = () => {
    const recaptcha = new RecaptchaVerifier("recaptcha-container", {}, auth);
    signInWithPhoneNumber(auth, phone, recaptcha)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        alert("OTP sent!");
      })
      .catch((error) => console.error("Error sending OTP:", error));
  };

  const verifyOTP = () => {
    const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
    auth.signInWithCredential(credential)
      .then((userCredential) => {
        onUserAuthenticated(userCredential.user);
      })
      .catch((error) => console.error("Error verifying OTP:", error));
  };

  return (
    <div>
      <h2>Sign In</h2>
      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button onClick={sendOTP}>Send OTP</button>
      <div id="recaptcha-container"></div>
      {verificationId && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}
    </div>
  );
};

export default Auth;
