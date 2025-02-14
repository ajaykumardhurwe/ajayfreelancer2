
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../services/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import MCQTest from "./MCQTest";
import "../styles/DetailsPage.css";

const DetailsPage = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const navigate = useNavigate(); // To navigate back to the previous page
  const [item, setItem] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Fetch the item details from Firebase
  useEffect(() => {
    const fetchItem = async () => {
      const itemRef = doc(db, "items", id);
      const docSnap = await getDoc(itemRef);
      if (docSnap.exists()) {
        setItem(docSnap.data());
        setEditContent(docSnap.data().description || "");
      } else {
        console.log("No such document!");
      }
    };
    fetchItem();
  }, [id]);

  // Update the item details in Firebase
  const handleUpdate = async () => {
    if (editContent.trim()) {
      const itemRef = doc(db, "items", id);
      await updateDoc(itemRef, {description: editContent });
      setItem({ ...item, description: editContent });
      alert("Content updated successfully!");
    }
  };

  return (
    <div className="details">
      {item ? (
        <>
          <button className="back-button" onClick={() => navigate(-1)}>
            Back
          </button>
          

          <h1>{item.title}</h1>
          {/* <h1>{item.mcqDetails}</h1> */}
          <img src={item.thumbnail} alt={item.title} className="details-img" />
          <p>
            <strong>Description:</strong>
          </p>
          <textarea
            className="edit-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button className="update-button" onClick={handleUpdate}>
            Update Content
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailsPage;






