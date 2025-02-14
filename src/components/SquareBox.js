// import React, { useState, useEffect } from "react";
// import { db } from "../services/firebaseConfig";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { Link } from "react-router-dom";
// import { CSVLink } from "react-csv";
// import '../styles/SquareBox.css'
// // import "./styles.css";

// const Home = () => {
//   const [items, setItems] = useState([]);
//   const [newItem, setNewItem] = useState({
//     title: "",
//     thumbnail: "",
//     description: "",
//   });

//   const itemsCollection = collection(db, "items");

//   const fetchItems = async () => {
//     const data = await getDocs(itemsCollection);
//     setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//   };

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewItem({ ...newItem, [name]: value });
//   };

//   const handleAdd = async () => {
//     if (newItem.title && newItem.thumbnail && newItem.description) {
//       await addDoc(itemsCollection, newItem);
//       fetchItems();
//       setNewItem({ title: "", thumbnail: "", description: "" });
//     }
//   };

//   const handleDelete = async (id) => {
//     await deleteDoc(doc(db, "items", id));
//     fetchItems();
//   };

//   return (
//     <div className="container">
//       <h1>Item List</h1>
//       <div className="form">
//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           value={newItem.title}
//           onChange={handleInputChange}
//         />
//         <input
//           type="text"
//           name="thumbnail"
//           placeholder="Thumbnail URL"
//           value={newItem.thumbnail}
//           onChange={handleInputChange}
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={newItem.description}
//           onChange={handleInputChange}
//         />
//         <button onClick={handleAdd}>Add Item</button>
//       </div>
//       <CSVLink data={items} filename="items.csv" className="csv-link">
//         Export to CSV
//       </CSVLink>
//       <div className="grid">
//         {items.map((item) => (
//           <div key={item.id} className="card">
//             <img src={item.thumbnail} alt={item.title} />
//             <h3>{item.title}</h3>
//             <p>{item.description}</p>
//             <Link to={`/details/${item.id}`}>
//               <button>Details</button>
//             </Link>
//             <button onClick={() => handleDelete(item.id)}>Delete</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;




import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import '../styles/SquareBox.css';

const Home = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: "",
    thumbnail: "",
    description: "",
    link: "", // New field for link
  });

  const itemsCollection = collection(db, "items");

  const fetchItems = async () => {
    const data = await getDocs(itemsCollection);
    setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAdd = async () => {
    if (newItem.title && newItem.thumbnail && newItem.description && newItem.link) {
      await addDoc(itemsCollection, newItem);
      fetchItems();
      setNewItem({ title: "", thumbnail: "", description: "", link: "" });
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "items", id));
    fetchItems();
  };

  return (
    <div className="container">
    
    
    
      {/* <h1>Item List</h1>
      <div className="form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newItem.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail URL"
          value={newItem.thumbnail}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newItem.description}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="link"
          placeholder="Link URL"
          value={newItem.link}
          onChange={handleInputChange}
        />


        <button onClick={handleAdd}>Add Item</button>
     
     
     
      </div> */}


      

      {/* <CSVLink data={items} filename="items.csv" className="csv-link">
        Export to CSV
      </CSVLink> */}

      <div className="grid">
        {items.map((item) => (
          <div key={item.id} className="card">
            <img src={item.thumbnail} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Link to={`/details/${item.id}`}>
              <button>Details</button>
            </Link>
           
           
            {/* <button onClick={() => handleDelete(item.id)}>Delete</button> */}
           <br></br>
            <button></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;









