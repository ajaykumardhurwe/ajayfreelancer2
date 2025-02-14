import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import "../styles/IindianConstitutionMcq.css";

const IindianConstitutionMcq = () => {
  const [mcqs, setMcqs] = useState([]);
  const [newMcq, setNewMcq] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const mcqCollection = collection(db, "mcqs");

  // Fetch MCQs from Firebase
  const fetchMcqs = async () => {
    const data = await getDocs(mcqCollection);
    setMcqs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchMcqs();
  }, []);

  // Handle input change for new MCQ
  const handleInputChange = (e, index) => {
    if (typeof index === "number") {
      const updatedOptions = [...newMcq.options];
      updatedOptions[index] = e.target.value;
      setNewMcq({ ...newMcq, options: updatedOptions });
    } else {
      setNewMcq({ ...newMcq, [e.target.name]: e.target.value });
    }
  };

  // Add a new MCQ
  const handleAdd = async () => {
    if (newMcq.question && newMcq.correctAnswer) {
      await addDoc(mcqCollection, newMcq);
      fetchMcqs();
      setNewMcq({ question: "", options: ["", "", "", ""], correctAnswer: "" });
    }
  };

  // Delete an MCQ
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "mcqs", id));
    fetchMcqs();
  };

  // Update an MCQ
  const handleUpdate = async (id, updatedData) => {
    const mcqRef = doc(db, "mcqs", id);
    await updateDoc(mcqRef, updatedData);
    fetchMcqs();
  };

  // Import MCQs from CSV
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          const importedData = result.data.map((item) => ({
            question: item.question,
            options: [item.option1, item.option2, item.option3, item.option4],
            correctAnswer: item.correctAnswer,
          }));
          for (const mcq of importedData) {
            await addDoc(mcqCollection, mcq);
          }
          fetchMcqs();
        },
      });
    }
  };

  return (
    <div className="container">
      <h1>MCQ Test</h1>

      {/* Add MCQ Form */}
      <div className="form">
        <input
          type="text"
          name="question"
          placeholder="Enter Question"
          value={newMcq.question}
          onChange={handleInputChange}
        />
        {newMcq.options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleInputChange(e, index)}
          />
        ))}
        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct Answer"
          value={newMcq.correctAnswer}
          onChange={handleInputChange}
        />
        <button onClick={handleAdd}>Add MCQ</button>
      </div>

      {/* Import/Export Buttons */}
      <div className="import-export">
        <CSVLink
          data={mcqs.map((mcq) => ({
            question: mcq.question,
            option1: mcq.options[0],
            option2: mcq.options[1],
            option3: mcq.options[2],
            option4: mcq.options[3],
            correctAnswer: mcq.correctAnswer,
          }))}
          filename="mcqs.csv"
          className="csv-link"
        >
          Export MCQs
        </CSVLink>
        <input type="file" accept=".csv" onChange={handleImport} />
      </div>

      {/* MCQ List */}
      <div className="grid">
        {mcqs.map((mcq) => (
          <div key={mcq.id} className="card">
            <h3>{mcq.question}</h3>
            <ul>
              {mcq.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
            <p>
              <strong>Correct Answer:</strong> {mcq.correctAnswer}
            </p>
            <button
              onClick={() =>
                handleUpdate(mcq.id, {
                  ...mcq,
                  question: `${mcq.question} (Updated)`,
                })
              }
            >
              Update
            </button>
            <button onClick={() => handleDelete(mcq.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IindianConstitutionMcq;
