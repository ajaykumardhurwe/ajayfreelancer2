import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import '../styles/EnglishClass.css';

const EnglishClass = () => {
  const [tab, setTab] = useState('content'); // "content" or "video"
  const [contentItems, setContentItems] = useState([]);
  const [videoItems, setVideoItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [user, setUser] = useState(null);

  const contentCollectionRef = collection(db, 'content');
  const videoCollectionRef = collection(db, 'videos');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const contentData = await getDocs(contentCollectionRef);
      setContentItems(contentData.docs.map(doc => ({ ...doc.data(), id: doc.id })));

      const videoData = await getDocs(videoCollectionRef);
      setVideoItems(videoData.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  const handleAddOrUpdateContent = async () => {
    if (!title || !description) {
      alert('Please fill all fields!');
      return;
    }

    const contentData = { title, description };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'content', editingId), contentData);
        setContentItems(contentItems.map(item => (item.id === editingId ? { ...item, ...contentData } : item)));
      } else {
        const docRef = await addDoc(contentCollectionRef, contentData);
        setContentItems([...contentItems, { ...contentData, id: docRef.id }]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleAddOrUpdateVideo = async () => {
    if (!title || !videoUrl) {
      alert('Please fill all fields!');
      return;
    }

    const videoData = { title, videoUrl, description };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'videos', editingId), videoData);
        setVideoItems(videoItems.map(item => (item.id === editingId ? { ...item, ...videoData } : item)));
      } else {
        const docRef = await addDoc(videoCollectionRef, videoData);
        setVideoItems([...videoItems, { ...videoData, id: docRef.id }]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleEdit = (id, type) => {
    const items = type === 'content' ? contentItems : videoItems;
    const item = items.find(item => item.id === id);
    if (item) {
      setTitle(item.title);
      setDescription(item.description || '');
      setVideoUrl(item.videoUrl || '');
      setEditingId(id);
    }
  };

  const handleDelete = async (id, type) => {
    const ref = type === 'content' ? contentCollectionRef : videoCollectionRef;
    try {
      await deleteDoc(doc(ref, id));
      if (type === 'content') {
        setContentItems(contentItems.filter(item => item.id !== id));
      } else {
        setVideoItems(videoItems.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setEditingId(null);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);
  };

  const importFromCSV = (type) => {
    if (!csvFile) {
      alert('No CSV file selected');
      return;
    }
    Papa.parse(csvFile, {
      complete: async (result) => {
        const newItems = result.data.map(row => ({
          title: row[0],
          description: row[1],
          videoUrl: row[2] || '',
        }));
        try {
          const ref = type === 'content' ? contentCollectionRef : videoCollectionRef;
          const promises = newItems.map(item => addDoc(ref, item));
          const docRefs = await Promise.all(promises);
          if (type === 'content') {
            setContentItems([...contentItems, ...newItems.map((item, idx) => ({ ...item, id: docRefs[idx].id }))]);
          } else {
            setVideoItems([...videoItems, ...newItems.map((item, idx) => ({ ...item, id: docRefs[idx].id }))]);
          }
        } catch (error) {
          console.error('Error importing items:', error);
        }
      },
      header: false, // Adjust based on CSV format
    });
  };

  const exportToCSV = (type) => {
    const items = type === 'content' ? contentItems : videoItems;
    const csvData = items.map(item => [
      item.title,
      item.description,
      item.videoUrl || '',
    ]);
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${type}.csv`);
  };

  if (!user) return <div>Please sign in to manage content and videos.</div>;

  return (
    <div className="english-class">
     









      {/* <h2>English Class Management</h2>

      <div className="tabs">
        <button onClick={() => setTab('content')}>Content</button>
        <button onClick={() => setTab('video')}>Videos</button>
      </div>

      <div className="form">
        {tab === 'content' ? (
          <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateContent(); }}>
            <label>Title:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title"
            />
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter content description"
            />
            <button type="submit">{editingId ? 'Update' : 'Add'} Content</button>
            {editingId && <button onClick={resetForm}>Cancel</button>}
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdateVideo(); }}>
            <label>Title:</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />
            <label>Video URL:</label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL"
            />
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
            />
            <button type="submit">{editingId ? 'Update' : 'Add'} Video</button>
            {editingId && <button onClick={resetForm}>Cancel</button>}
          </form>
        )}
      </div> */}






       <h3>Import & Export</h3>
      <input type="file" accept=".csv" onChange={handleCSVUpload} />
      <button onClick={() => importFromCSV(tab)}>Import from CSV</button>
      <button onClick={() => exportToCSV(tab)}>Export to CSV</button>

      <h3>{tab === 'content' ? 'Content' : 'Videos'}</h3>
     



    
      <div className="items-list">
        {(tab === 'content' ? contentItems : videoItems).map(item => (
          <div key={item.id} className="item">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            {item.videoUrl && <iframe src={item.videoUrl} title={item.title} width="200" height="150" />}
           
           
            {/* <button onClick={() => handleEdit(item.id, tab)}>Edit</button> */}
            {/* <button onClick={() => handleDelete(item.id, tab)}>Delete</button> */}
        
        
          </div>
        ))}
         <button></button>
         <button></button>
         <button></button>

      </div>
      <button></button>

    </div>
  );
};

export default EnglishClass;
