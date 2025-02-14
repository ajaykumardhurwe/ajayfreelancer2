
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
// import '../sstyles/CrudOperations.css';
import '../styles/CrudOperations.css'
const CrudOperations = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', thumbnail: '', description: '', link: '' });

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'items'));
      setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'items'), form);
    setForm({ title: '', thumbnail: '', description: '', link: '' });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'items', id));
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="crud-container">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input type="text" placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
        <input type="text" placeholder="Learn More Link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <button type="submit">Add Item</button>
      </form>
      <div className="item-list">
        {items.map(item => (
          <div key={item.id} className="item">
            <h3>{item.title}</h3>
            <img src={item.thumbnail} alt={item.title} />
            <p>{item.description}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer">Learn More</a>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrudOperations;
