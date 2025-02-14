// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { db } from "../services/firebaseConfig"; // Import your Firebase configuration
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import "../styles/ClassScreen.css"; // Import corresponding CSS

// const ClassScreen = () => {
//   const [classData, setClassData] = useState([]);
//   const [newClass, setNewClass] = useState({
//     title: "",
//     description: "",
//     images: [],
//   });
//   const [editClass, setEditClass] = useState(null);

//   const classCollectionRef = collection(db, "classes");

//   // Fetch data from Firestore
//   const fetchClassData = async () => {
//     const data = await getDocs(classCollectionRef);
//     setClassData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//   };

//   // Add a new class
//   const addClass = async () => {
//     if (newClass.title && newClass.description && newClass.images.length) {
//       await addDoc(classCollectionRef, newClass);
//       setNewClass({ title: "", description: "", images: [] });
//       fetchClassData();
//     } else {
//       alert("Please fill all fields and provide at least one image!");
//     }
//   };

//   // Update a class
//   const updateClass = async (id) => {
//     const classDoc = doc(db, "classes", id);
//     await updateDoc(classDoc, editClass);
//     setEditClass(null);
//     fetchClassData();
//   };

//   // Delete a class
//   const deleteClass = async (id) => {
//     const classDoc = doc(db, "classes", id);
//     await deleteDoc(classDoc);
//     fetchClassData();
//   };

//   useEffect(() => {
//     fetchClassData();
//   }, []);

//   return (
//     <div className="class-screen-container">
//       {/* Add Class Form */}
//       <div className="form-container">
//         <h2>Add New Class</h2>
//         <input
//           type="text"
//           placeholder="Title"
//           value={newClass.title}
//           onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
//         />
//         <textarea
//           placeholder="Description"
//           value={newClass.description}
//           onChange={(e) =>
//             setNewClass({ ...newClass, description: e.target.value })
//           }
//         ></textarea>
//         <input
//           type="text"
//           placeholder="Image URLs (comma-separated)"
//           onChange={(e) =>
//             setNewClass({
//               ...newClass,
//               images: e.target.value.split(",").map((url) => url.trim()),
//             })
//           }
//         />
//         <button onClick={addClass}>Add Class</button>
//       </div>

//       {/* Class List */}
//       <div className="class-list">
//         {classData.map((cls) => (
//           <div className="class-card" key={cls.id}>
//             {editClass && editClass.id === cls.id ? (
//               <div className="edit-form">
//                 <h2>Edit Class</h2>
//                 <input
//                   type="text"
//                   placeholder="Title"
//                   value={editClass.title}
//                   onChange={(e) =>
//                     setEditClass({ ...editClass, title: e.target.value })
//                   }
//                 />
//                 <textarea
//                   placeholder="Description"
//                   value={editClass.description}
//                   onChange={(e) =>
//                     setEditClass({ ...editClass, description: e.target.value })
//                   }
//                 ></textarea>
//                 <input
//                   type="text"
//                   placeholder="Image URLs (comma-separated)"
//                   value={editClass.images.join(", ")}
//                   onChange={(e) =>
//                     setEditClass({
//                       ...editClass,
//                       images: e.target.value
//                         .split(",")
//                         .map((url) => url.trim()),
//                     })
//                   }
//                 />
//                 <button onClick={() => updateClass(cls.id)}>Save</button>
//                 <button onClick={() => setEditClass(null)}>Cancel</button>
//               </div>
//             ) : (
//               <>
//                 <h2>{cls.title}</h2>
//                 <div className="image-slider">
//                   {cls.images.map((img, index) => (
//                     <img
//                       key={index}
//                       src={img}
//                       alt={`Slide ${index + 1}`}
//                       className="slider-image"
//                     />
//                   ))}
//                 </div>
//                 <p>{cls.description}</p>
//                 <div className="action-buttons">
//                   <Link to={`/class/${cls.id}`} className="navigate-button">
//                     View Details
//                   </Link>
//                   <button
//                     onClick={() =>
//                       setEditClass({
//                         id: cls.id,
//                         title: cls.title,
//                         description: cls.description,
//                         images: cls.images,
//                       })
//                     }
//                   >
//                     Edit
//                   </button>
//                   <button onClick={() => deleteClass(cls.id)}>Delete</button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ClassScreen;






































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
     
     
     
     
     
     
{/*      
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
      </div> */}















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




                  {/* <button
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
                  </button> */}



                  {/* <button onClick={() => deleteClass(cls.id)}>Delete</button> */}
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
