import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/CodePlayground.css';

const CodePlayground = () => {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'source'
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World</h1>');
  const [cssCode, setCssCode] = useState('h1 { color: blue; }');
  const [jsCode, setJsCode] = useState('console.log("Hello, World!");');
  const [iframeSrc, setIframeSrc] = useState('');
  const [sourceList, setSourceList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateIframe = () => {
      const src = `
        <html>
          <head>
            <style>${cssCode}</style>
          </head>
          <body>
            ${htmlCode}
            <script>${jsCode}</script>
          </body>
        </html>
      `;
      setIframeSrc(src);
    };

    updateIframe();
  }, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchSourceList(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSourceList = async (userId) => {
    try {
      const q = query(collection(db, 'sourceCodes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const sources = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSourceList(sources);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const saveSourceCode = async () => {
    if (!user) {
      alert('You must be logged in to save source codes.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required.');
      return;
    }

    try {
      if (editingId) {
        // Update existing source
        const docRef = doc(db, 'sourceCodes', editingId);
        await updateDoc(docRef, {
          title,
          description,
          html: htmlCode,
          css: cssCode,
          js: jsCode,
        });
        alert('Source code updated successfully!');
        setEditingId(null);
      } else {
        // Add new source
        await addDoc(collection(db, 'sourceCodes'), {
          userId: user.uid, // Associate with the logged-in user
          title,
          description,
          html: htmlCode,
          css: cssCode,
          js: jsCode,
        });
        alert('Source code saved successfully!');
      }

      setTitle('');
      setDescription('');
      fetchSourceList(user.uid);
    } catch (error) {
      console.error('Error saving source:', error);
    }
  };

  const deleteSourceCode = async (id) => {
    try {
      await deleteDoc(doc(db, 'sourceCodes', id));
      alert('Source code deleted successfully!');
      fetchSourceList(user.uid);
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  const loadSourceCode = (source) => {
    setHtmlCode(source.html);
    setCssCode(source.css);
    setJsCode(source.js);
    setTitle(source.title);
    setDescription(source.description);
    setEditingId(source.id);
    setActiveTab('editor');
  };

  return (
    <div className="code-playground">
      <h1>Code Playground</h1>
      {user ? <p>Welcome, {user.email}</p> : <p>Please log in to save and view your source codes.</p>}
      <div className="tabs">
        <button onClick={() => setActiveTab('editor')} className={activeTab === 'editor' ? 'active' : ''}>
          Editor
        </button>
        <button onClick={() => setActiveTab('source')} className={activeTab === 'source' ? 'active' : ''}>
          Source Codes
        </button>
      </div>

      {activeTab === 'editor' && (
        <div className="editor-tab">
          <div className="meta">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="editors">
            <div className="editor">
              <h2>HTML</h2>
              <textarea value={htmlCode} onChange={(e) => setHtmlCode(e.target.value)} />
            </div>
            <div className="editor">
              <h2>CSS</h2>
              <textarea value={cssCode} onChange={(e) => setCssCode(e.target.value)} />
            </div>
            <div className="editor">
              <h2>JavaScript</h2>
              <textarea value={jsCode} onChange={(e) => setJsCode(e.target.value)} />
            </div>
          </div>
          <div className="actions">
            <button onClick={saveSourceCode}>{editingId ? 'Update Code' : 'Save Code'}</button>
          </div>
          <div className="output">
            <h2>Output</h2>
            <iframe title="code-output" srcDoc={iframeSrc} sandbox="allow-scripts" />
          </div>
        </div>
      )}

      {activeTab === 'source' && (
        <div className="source-tab">
          <h2>Source Codes</h2>
          {sourceList.map((source) => (
            <div key={source.id} className="source-item">
              <div className="source-header">
                <h3>{source.title}</h3>
                <button onClick={() => loadSourceCode(source)}>Load</button>
                <button onClick={() => deleteSourceCode(source.id)}>Delete</button>
              </div>
              <details>
                <summary>Description</summary>
                <p>{source.description}</p>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodePlayground;
