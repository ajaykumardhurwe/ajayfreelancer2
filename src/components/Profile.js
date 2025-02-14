import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
// import '../styles/Profile.css'


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    address: "",
    bio: "",
    mobileNumber: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch user data from Firestore
  const fetchUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserData(currentUser.uid);
      } else {
        navigate("/signin"); // Redirect to SignIn if not logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle form submission
  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, userData);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/signin");
    } catch (error) {
      console.error("Logout Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Profile Page</h2>
      {user ? (
        <div>
          {isEditing ? (
            <form>
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Username"
                value={userData.username}
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                value={userData.address}
                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
              />
              <textarea
                placeholder="Bio"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              ></textarea>
              <input
                type="text"
                placeholder="Mobile Number"
                value={userData.mobileNumber}
                onChange={(e) =>
                  setUserData({ ...userData, mobileNumber: e.target.value })
                }
              />
              <button type="button" onClick={handleSave}>
                Save
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {userData.name || "Not provided"}</p>
              <p><strong>Username:</strong> {userData.username || "Not provided"}</p>
              <p><strong>Address:</strong> {userData.address || "Not provided"}</p>
              <p><strong>Bio:</strong> {userData.bio || "Not provided"}</p>
              <p><strong>Mobile Number:</strong> {userData.mobileNumber || "Not provided"}</p>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          )}
          <button onClick={handleLogout} style={{ marginTop: "20px" }}>
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
