import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../services/firebaseConfig"; // Import your Firebase configuration
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import '../styles/ClassScreen.css'; // Import corresponding CSS

const ClassScreen = () => {
  const [classData, setClassData] = useState([]);
  const [newClass, setNewClass] = useState({
    title: "",
    description: "",
    images: [],
  });
  const [editClass, setEditClass] = useState(null);
  const navigate = useNavigate();

  const classCollectionRef = collection(db, "classes");

  // Fetch data from Firestore
  const fetchClassData = async () => {
    const data = await getDocs(classCollectionRef);
    setClassData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Add a new class
  const addClass = async () => {
    if (newClass.title && newClass.description && newClass.images.length) {
      await addDoc(classCollectionRef, newClass);
      setNewClass({ title: "", description: "", images: [] });
      fetchClassData();
    } else {
      alert("Please fill all fields and provide at least one image!");
    }
  };

  // Update a class
  const updateClass = async (id) => {
    const classDoc = doc(db, "classes", id);
    await updateDoc(classDoc, editClass);
    setEditClass(null);
    fetchClassData();
  };

  // Delete a class
  const deleteClass = async (id) => {
    const classDoc = doc(db, "classes", id);
    await deleteDoc(classDoc);
    fetchClassData();
  };

  useEffect(() => {
    fetchClassData();
  }, []);

  return (
    <div className="class-screen-container">
      {/* Add Class Form */}
     
     
     
     
     
      <div className="form-container">
        <h2>Add New Class</h2>
        <input
          type="text"
          placeholder="Title"
          value={newClass.title}
          onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newClass.description}
          onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
        ></textarea>
        <input
          type="text"
          placeholder="Image URLs (comma-separated)"
          onChange={(e) =>
            setNewClass({
              ...newClass,
              images: e.target.value.split(",").map((url) => url.trim()),
            })
          }
        />
        <button onClick={addClass}>Add Class</button>
      </div>







      {/* Class List */}
      <div className="class-list">
        {classData.map((cls) => (
          <div className="class-card" key={cls.id}>
            {editClass && editClass.id === cls.id ? (
              <div className="edit-form">
                <h2>Edit Class</h2>
                <input
                  type="text"
                  placeholder="Title"
                  value={editClass.title}
                  onChange={(e) =>
                    setEditClass({ ...editClass, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="Description"
                  value={editClass.description}
                  onChange={(e) =>
                    setEditClass({ ...editClass, description: e.target.value })
                  }
                ></textarea>
                <input
                  type="text"
                  placeholder="Image URLs (comma-separated)"
                  value={editClass.images.join(", ")}
                  onChange={(e) =>
                    setEditClass({
                      ...editClass,
                      images: e.target.value.split(",").map((url) => url.trim()),
                    })
                  }
                />
                <button onClick={() => updateClass(cls.id)}>Save</button>
                <button onClick={() => setEditClass(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <h2>{cls.title}</h2>
                <div className="image-slider">
                  {cls.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Slide ${index + 1}`}
                      className="slider-image"
                    />
                  ))}
                </div>
                <p>{cls.description}</p>
                <div className="action-buttons">
                  <Link to="/englishclass" className="navigate-button">
                    View Details
                  </Link>
                  <button
                    onClick={() =>
                      setEditClass({
                        id: cls.id,
                        title: cls.title,
                        description: cls.description,
                        images: cls.images,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteClass(cls.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassScreen;














// import React, { useState, useEffect } from "react";
// import { db } from "../services/firebaseConfig";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import "../styles/ClassScreen.css";

// const ClassScreen = () => {
//   const [cards, setCards] = useState([]);
//   const [title, setTitle] = useState("");
//   const [thumbnail, setThumbnail] = useState("");
//   const [description, setDescription] = useState("");
//   const [newTextTitle, setNewTextTitle] = useState("");
//   const [newTextDescription, setNewTextDescription] = useState("");
//   const [selectedCardId, setSelectedCardId] = useState(null);
//   const [activeTab, setActiveTab] = useState("text");

//   const cardsCollection = collection(db, "cards");

//   const fetchCards = async () => {
//     try {
//       const data = await getDocs(cardsCollection);
//       setCards(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error("Error fetching cards:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCards();
//   }, []);

//   const addCard = async () => {
//     if (!title || !thumbnail || !description) {
//       alert("All fields are required!");
//       return;
//     }
//     try {
//       await addDoc(cardsCollection, {
//         title,
//         thumbnail,
//         description,
//         textContent: [],
//         videos: [],
//       });
//       fetchCards();
//       setTitle("");
//       setThumbnail("");
//       setDescription("");
//     } catch (error) {
//       console.error("Error adding card:", error);
//     }
//   };

//   const addTextContent = async (cardId) => {
//     if (!newTextTitle || !newTextDescription) {
//       alert("All fields are required!");
//       return;
//     }
//     try {
//       const cardRef = doc(db, "cards", cardId);
//       const card = cards.find((card) => card.id === cardId);
//       const updatedTextContent = [
//         ...(card.textContent || []),
//         { title: newTextTitle, description: newTextDescription },
//       ];
//       await updateDoc(cardRef, { textContent: updatedTextContent });
//       fetchCards();
//       setNewTextTitle("");
//       setNewTextDescription("");
//     } catch (error) {
//       console.error("Error adding text content:", error);
//     }
//   };

//   const deleteTextContent = async (cardId, index) => {
//     try {
//       const cardRef = doc(db, "cards", cardId);
//       const card = cards.find((card) => card.id === cardId);
//       const updatedTextContent = [...card.textContent];
//       updatedTextContent.splice(index, 1);
//       await updateDoc(cardRef, { textContent: updatedTextContent });
//       fetchCards();
//     } catch (error) {
//       console.error("Error deleting text content:", error);
//     }
//   };

//   const toggleTab = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <div className="class-screen">
//       <h1>Card Management</h1>
//       <div className="add-card">
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Thumbnail URL"
//           value={thumbnail}
//           onChange={(e) => setThumbnail(e.target.value)}
//         />
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         ></textarea>
//         <button onClick={addCard}>Add Card</button>
//       </div>
//       <div className="card-list">
//         {cards.map((card) => (
//           <div key={card.id} className="card">
//             <img src={card.thumbnail} alt={card.title} />
//             <h3>{card.title}</h3>
//             <button onClick={() => deleteDoc(doc(db, "cards", card.id))}>Delete</button>
//             <div className="tabs">
//               <button
//                 className={activeTab === "text" ? "active" : ""}
//                 onClick={() => toggleTab("text")}
//               >
//                 Text Content
//               </button>
//               <button
//                 className={activeTab === "video" ? "active" : ""}
//                 onClick={() => toggleTab("video")}
//               >
//                 Video Content
//               </button>
//             </div>
//             <div className="tab-content">
//               {activeTab === "text" ? (
//                 <div className="slide-view">
//                   <div className="text-slider">
//                     {card.textContent?.map((text, index) => (
//                       <div key={index} className="slide">
//                         <h4>{text.title}</h4>
//                         <p>{text.description}</p>
//                         <button
//                           onClick={() => deleteTextContent(card.id, index)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="New Text Title"
//                     value={newTextTitle}
//                     onChange={(e) => setNewTextTitle(e.target.value)}
//                   />
//                   <textarea
//                     placeholder="New Text Description"
//                     value={newTextDescription}
//                     onChange={(e) => setNewTextDescription(e.target.value)}
//                   ></textarea>
//                   <button onClick={() => addTextContent(card.id)}>
//                     Add Text Content
//                   </button>
//                 </div>
//               ) : (
//                 <div className="slide-view">
//                   {card.videos && card.videos.length > 0 ? (
//                     <ul className="video-slider">
//                       {card.videos.map((videoId, index) => (
//                         <li key={index} className="slide">
//                           <iframe
//                             width="100%"
//                             height="315"
//                             src={`https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1`}
//                             title={`YouTube video ${index + 1}`}
//                             frameBorder="0"
//                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                             allowFullScreen
//                           ></iframe>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p>No videos added.</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ClassScreen;
