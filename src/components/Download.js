import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import '../styles/Download.css';

const Download = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null); // ID of the item being edited

  const downloadsCollection = collection(db, "downloads");

  // Function to add data to Firebase Firestore
  const addData = async () => {
    if (title && description && link) {
      try {
        if (editingId) {
          // Update existing item
          const docRef = doc(db, "downloads", editingId);
          await updateDoc(docRef, { title, description, link });
          setEditingId(null);
        } else {
          // Add new item
          await addDoc(downloadsCollection, { title, description, link });
        }
        setTitle('');
        setDescription('');
        setLink('');
        fetchData(); // Refresh data after operation
      } catch (e) {
        console.error("Error saving document: ", e);
      }
    } else {
      alert("Please fill all fields");
    }
  };

  // Fetch data from Firestore
  const fetchData = async () => {
    const querySnapshot = await getDocs(downloadsCollection);
    const fetchedData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(fetchedData);
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "downloads", id);
      await deleteDoc(docRef);
      fetchData(); // Refresh data after deletion
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  // Handle edit operation
  const handleEdit = (item) => {
    setEditingId(item.id); // Set the editing ID
    setTitle(item.title);
    setDescription(item.description);
    setLink(item.link);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="content">
     
      <div className="links-list">
        {data.map((item) => (
          <div key={item.id} className="link-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button onClick={() => window.open(item.link, '_blank')}>
              Open Link
            </button>
            {/* <button onClick={() => handleEdit(item)}>
              Edit
            </button>
            <button onClick={() => handleDelete(item.id)}>
              Delete
            </button> */}


          </div>
        ))}
      </div>
    </div>
  );
};

export default Download;





