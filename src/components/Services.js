// // import React from 'react';

// // const Services = () => {
// //   return (
// //     <div className="content">
// //       <h1>Services</h1>
// //       <p>Discover our services here.</p>
// //     </div>
// //   );
// // };

// // export default Services;




import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import '../styles/CardView.css';

const MCQCardView = () => {
  const [mcqs, setMcqs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
  });

  const mcqCollectionRef = collection(db, 'mcqs');

  useEffect(() => {
    const fetchMCQs = async () => {
      const data = await getDocs(mcqCollectionRef);
      setMcqs(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchMCQs();
  }, []);

  const handleInputChange = (field, value, optionIndex = null) => {
    if (optionIndex !== null) {
      const updatedOptions = [...formData.options];
      updatedOptions[optionIndex] = value;
      setFormData({ ...formData, options: updatedOptions });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleAddOrUpdate = async () => {
    const { question, options, answer, explanation } = formData;

    if (!question || options.some(opt => !opt) || !answer) {
      alert('Please fill all fields!');
      return;
    }

    const mcqData = { question, options, answer, explanation };

    try {
      if (editingId) {
        // Update existing MCQ
        await updateDoc(doc(db, 'mcqs', editingId), mcqData);
        setMcqs(mcqs.map(mcq => (mcq.id === editingId ? { ...mcq, ...mcqData } : mcq)));
      } else {
        // Add new MCQ
        const docRef = await addDoc(mcqCollectionRef, mcqData);
        setMcqs([...mcqs, { ...mcqData, id: docRef.id }]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving MCQ:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'mcqs', id));
      setMcqs(mcqs.filter(mcq => mcq.id !== id));
    } catch (error) {
      console.error('Error deleting MCQ:', error);
    }
  };

  const handleEdit = (mcq) => {
    setEditingId(mcq.id);
    setFormData({
      question: mcq.question,
      options: mcq.options,
      answer: mcq.answer,
      explanation: mcq.explanation,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      question: '',
      options: ['', '', '', ''],
      answer: '',
      explanation: '',
    });
  };

  return (
    <div>
      <h2>MCQ Card Management</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddOrUpdate();
        }}
      >
        <label>Question:</label>
        <textarea
          value={formData.question}
          onChange={(e) => handleInputChange('question', e.target.value)}
          placeholder="Enter question"
        />
        <label>Options:</label>
        {formData.options.map((opt, idx) => (
          <input
            key={idx}
            value={opt}
            onChange={(e) => handleInputChange('options', e.target.value, idx)}
            placeholder={`Option ${idx + 1}`}
          />
        ))}
        <label>Answer:</label>
        <input
          value={formData.answer}
          onChange={(e) => handleInputChange('answer', e.target.value)}
          placeholder="Correct answer"
        />
        <label>Explanation (optional):</label>
        <textarea
          value={formData.explanation}
          onChange={(e) => handleInputChange('explanation', e.target.value)}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'} MCQ</button>
        {editingId && <button onClick={resetForm}>Cancel</button>}
      </form>

      <div className="card-container">
        {mcqs.map(mcq => (
          <div key={mcq.id} className="card">
            <h3>{mcq.question}</h3>
            <ul>
              {mcq.options.map((option, idx) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
            <p><strong>Answer:</strong> {mcq.answer}</p>
            <p><strong>Explanation:</strong> {mcq.explanation || 'N/A'}</p>
            <button onClick={() => handleEdit(mcq)}>Edit</button>
            <button onClick={() => handleDelete(mcq.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MCQCardView;









// import React, { useState, useEffect } from 'react';
// import { db } from '../services/firebaseConfig';
// import { collection, getDocs } from 'firebase/firestore';
// // import '../styles/CardView.css';

// const MCQCardView = () => {
//   const [mcqs, setMcqs] = useState([]);
//   const [currentPage, setCurrentPage] = useState('list'); // "list" or "details"
//   const [selectedMCQ, setSelectedMCQ] = useState(null);

//   const mcqCollectionRef = collection(db, 'mcqs');

//   useEffect(() => {
//     const fetchMCQs = async () => {
//       const data = await getDocs(mcqCollectionRef);
//       setMcqs(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//     };
//     fetchMCQs();
//   }, []);

//   const handleNavigate = (mcq) => {
//     setSelectedMCQ(mcq);
//     setCurrentPage('details');
//   };

//   const handleBack = () => {
//     setSelectedMCQ(null);
//     setCurrentPage('list');
//   };

//   if (currentPage === 'details' && selectedMCQ) {
//     return (
//       <div>
//         <button onClick={handleBack}>Back</button>
//         <h2>{selectedMCQ.question}</h2>
//         <p>Answer: {selectedMCQ.answer}</p>
//         <p>Explanation: {selectedMCQ.explanation}</p>
//         <h4>Options:</h4>
//         <ul>
//           {selectedMCQ.options.map((option, idx) => (
//             <li key={idx}>{option}</li>
//           ))}
//         </ul>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2>MCQ Card List</h2>
//       <div className="card-container">
//         {mcqs.map(mcq => (
//           <div key={mcq.id} className="card">
//             <h3>{mcq.question}</h3>
//             <img
//               src="https://via.placeholder.com/150" // Placeholder thumbnail
//               alt="MCQ Thumbnail"
//               className="thumbnail"
//             />
//             <p>
//               <button
//                 onClick={() =>
//                   document.getElementById(`desc-${mcq.id}`).classList.toggle('hidden')
//                 }
//               >
//                 Toggle Explanation
//               </button>
//             </p>
//             <p id={`desc-${mcq.id}`} className="description hidden">
//               {mcq.explanation || 'No explanation provided.'}
//             </p>
//             <button onClick={() => handleNavigate(mcq)}>View Details</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MCQCardView;
