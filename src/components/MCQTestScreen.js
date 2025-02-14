
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../services/firebaseConfig"; // Import your Firebase configuration
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import '../styles/MCQTestScreen.css'


const MCQTestScreen = () => {
  const [mcqData, setMcqData] = useState([]);
  const [newMCQ, setNewMCQ] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [editMCQ, setEditMCQ] = useState(null);

  const mcqCollectionRef = collection(db, "mcqTests");

  // Fetch data from Firestore
  const fetchMCQData = async () => {
    const data = await getDocs(mcqCollectionRef);
    setMcqData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Add a new MCQ
  const addMCQ = async () => {
    if (newMCQ.title && newMCQ.description && newMCQ.image) {
      await addDoc(mcqCollectionRef, newMCQ);
      setNewMCQ({ title: "", description: "", image: "" }); // Reset form
      fetchMCQData();
    } else {
      alert("Please fill all fields!");
    }
  };

  // Update an MCQ
  const updateMCQ = async (id) => {
    const mcqDoc = doc(db, "mcqTests", id);
    await updateDoc(mcqDoc, editMCQ);
    setEditMCQ(null); // Exit edit mode
    fetchMCQData();
  };

  // Delete an MCQ
  const deleteMCQ = async (id) => {
    const mcqDoc = doc(db, "mcqTests", id);
    await deleteDoc(mcqDoc);
    fetchMCQData();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchMCQData();
  }, []);

  return (
    <div className="container">
      {/* Add MCQ Form */}
      {/* <div className="add-mcq-form">
        <h2>Add New MCQ</h2>
        <input
          type="text"
          placeholder="Title"
          value={newMCQ.title}
          onChange={(e) => setNewMCQ({ ...newMCQ, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newMCQ.description}
          onChange={(e) => setNewMCQ({ ...newMCQ, description: e.target.value })}
        ></textarea>
        <input
          type="text"
          placeholder="Image URL"
          value={newMCQ.image}
          onChange={(e) => setNewMCQ({ ...newMCQ, image: e.target.value })}
        />
        <button onClick={addMCQ}>Add MCQ</button>
      </div> */}












      {/* MCQ List */}
      {mcqData.map((mcq) => (
        <div className="column" key={mcq.id}>
          {editMCQ && editMCQ.id === mcq.id ? (
            <>
              <h2>Edit MCQ</h2>
              <input
                type="text"
                placeholder="Title"
                value={editMCQ.title}
                onChange={(e) => setEditMCQ({ ...editMCQ, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={editMCQ.description}
                onChange={(e) => setEditMCQ({ ...editMCQ, description: e.target.value })}
              ></textarea>
              <input
                type="text"
                placeholder="Image URL"
                value={editMCQ.image}
                onChange={(e) => setEditMCQ({ ...editMCQ, image: e.target.value })}
              />
              <button onClick={() => updateMCQ(mcq.id)}>Save</button>
              <button onClick={() => setEditMCQ(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h2 className="title">{mcq.title}</h2>
              <img
                src={mcq.image}
                alt={`Thumbnail for ${mcq.title}`}
                className="thumbnail"
              />
              <p className="description">{mcq.description}</p>
             
             <button className="button">
             <Link to="/test"  >
                Start Test
              </Link>

             </button>
             
             <button></button>
             <button></button>

              {/* <button
                onClick={() =>
                  setEditMCQ({ id: mcq.id, title: mcq.title, description: mcq.description, image: mcq.image })
                }
              >
                Edit
              </button> */}


              {/* <button onClick={() => deleteMCQ(mcq.id)}>Delete</button> */}
             


            </>
          )}
        </div>
      ))}
      

    </div>
  );
};

export default MCQTestScreen;
