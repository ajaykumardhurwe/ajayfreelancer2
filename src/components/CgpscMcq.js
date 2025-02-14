
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db, auth } from '../services/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const CgpscMcq = () => {
  const { id } = useParams();
  const [mcqs, setMcqs] = useState([]);
  const [mcq, setMcq] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [user, setUser] = useState(null);

  const mcqCollectionRef = collection(db, 'mcqs');

  // Authentication handling
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all MCQs
  useEffect(() => {
    const fetchMCQs = async () => {
      const data = await getDocs(mcqCollectionRef);
      setMcqs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchMCQs();
  }, []);

  // Fetch a single MCQ by ID
  useEffect(() => {
    if (id) {
      const fetchMCQ = async () => {
        const mcqDoc = doc(db, 'mcqs', id);
        const mcqData = await getDoc(mcqDoc);
        if (mcqData.exists()) {
          setMcq(mcqData.data());
        } else {
          console.log('MCQ not found');
        }
      };
      fetchMCQ();
    }
  }, [id]);

  const handleAddOrUpdate = async () => {
    if (!question || options.some((opt) => !opt) || !answer) {
      alert('Please fill all fields!');
      return;
    }

    const mcqData = { question, options, answer, explanation };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'mcqs', editingId), mcqData);
        setMcqs(mcqs.map((mcq) => (mcq.id === editingId ? { ...mcq, ...mcqData } : mcq)));
      } else {
        const docRef = await addDoc(mcqCollectionRef, mcqData);
        setMcqs([...mcqs, { ...mcqData, id: docRef.id }]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleEdit = (id) => {
    const mcq = mcqs.find((mcq) => mcq.id === id);
    if (mcq) {
      setQuestion(mcq.question);
      setOptions(mcq.options);
      setAnswer(mcq.answer);
      setExplanation(mcq.explanation);
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'mcqs', id));
      setMcqs(mcqs.filter((mcq) => mcq.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '', '', '']);
    setAnswer('');
    setExplanation('');
    setEditingId(null);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvFile(file);
  };

  const importFromCSV = () => {
    if (!csvFile) {
      alert('No CSV file selected');
      return;
    }
    Papa.parse(csvFile, {
      complete: async (result) => {
        const newMCQs = result.data.map((row) => ({
          question: row[0],
          options: row.slice(1, 5),
          answer: row[5],
          explanation: row[6],
        }));
        try {
          const promises = newMCQs.map((mcq) => addDoc(mcqCollectionRef, mcq));
          const docRefs = await Promise.all(promises);
          setMcqs([...mcqs, ...newMCQs.map((mcq, idx) => ({ ...mcq, id: docRefs[idx].id }))]);
        } catch (error) {
          console.error('Error importing questions:', error);
        }
      },
      header: false,
    });
  };

  const exportToCSV = () => {
    const csvData = mcqs.map((mcq) => [
      mcq.question,
      ...mcq.options,
      mcq.answer,
      mcq.explanation || '',
    ]);
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'mcqs.csv');
  };

  if (!user) return <div>Please sign in to manage MCQs.</div>;

  if (id && mcq) {
    return (
      <div>
        <h1>{mcq.title}</h1>
        {mcq.image && <img src={mcq.image} alt={mcq.title} />}
        <p>{mcq.description}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>CgPsc MCQ</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddOrUpdate();
        }}
      >
        <label>Question:</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
        />
        <label>Options:</label>
        {options.map((opt, idx) => (
          <input
            key={idx}
            value={opt}
            onChange={(e) => {
              const updatedOptions = [...options];
              updatedOptions[idx] = e.target.value;
              setOptions(updatedOptions);
            }}
            placeholder={`Option ${idx + 1}`}
          />
        ))}
        <label>Answer:</label>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Correct answer"
        />
        <label>Explanation (optional):</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} Question</button>
        {editingId && <button onClick={resetForm}>Cancel</button>}
      </form>

      <h3>Import & Export</h3>
      <input type="file" accept=".csv" onChange={handleCSVUpload} />
      <button onClick={importFromCSV}>Import from CSV</button>
      <button onClick={exportToCSV}>Export to CSV</button>

      <h3>All Questions</h3>
      <ul>
        {mcqs.map((mcq) => (
          <li key={mcq.id}>
            <p>
              <strong>{mcq.question}</strong>
              <button onClick={() => handleEdit(mcq.id)}>Edit</button>
              <button onClick={() => handleDelete(mcq.id)}>Delete</button>
            </p>
            <ul>
              {mcq.options.map((opt, idx) => (
                <li key={idx}>{opt}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CgpscMcq;































