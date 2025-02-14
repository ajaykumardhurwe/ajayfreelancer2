import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
// import '../styles/ClassDetail2.css';

const ClassDetail2 = () => {
  const { id } = useParams(); // Get the `id` from the URL
  const [ClassDetail2, setClassDetail2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the class details whenever the `id` changes
    const fetchClassDetail2 = async () => {
      setLoading(true);
      try {
        const classDoc = doc(db, "classes", id); // Fetch document using `id`
        const docSnap = await getDoc(classDoc);
        if (docSnap.exists()) {
          setClassDetail2({ id: docSnap.id, ...docSnap.data() });
          setError("");
        } else {
          setClassDetail2(null);
          setError("Class not found!");
        }
      } catch (err) {
        console.error("Error fetching class details:", err);
        setError("Error fetching class details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetail2();
  }, [id]); // Re-run the effect whenever `id` changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="class-detail-container">
      <h1>{ClassDetail2.title}</h1>
      <div className="image-slider">
        {ClassDetail2.images.map((img, index) => (
          <img key={index} src={img} alt={`Slide ${index + 1}`} />
        ))}
      </div>
      <p>{ClassDetail2.description}</p>
    </div>
  );
};

export default ClassDetail2;
