
import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import "../styles/PostScreen.css";

const PostScreen = () => {
  const [user, setUser] = useState(null);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  useEffect(() => {
    // Track user authentication state
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Fetch questions in real-time
    const q = query(collection(db, "questions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setQuestions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const handleAskQuestion = async () => {
    if (!user) {
      alert("Please login to ask a question!");
      return;
    }

    if (!question.trim()) {
      alert("Question cannot be empty!");
      return;
    }

    try {
      await addDoc(collection(db, "questions"), {
        question,
        username: user.email,
        timestamp: Timestamp.now(),
        answers: [],
      });

      setQuestion("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAnswer = async (questionId) => {
    if (!user) {
      alert("Please login to answer a question!");
      return;
    }

    if (!answer.trim()) {
      alert("Answer cannot be empty!");
      return;
    }

    try {
      const questionRef = doc(db, "questions", questionId);
      const questionSnapshot = questions.find((q) => q.id === questionId);
      const updatedAnswers = [
        ...(questionSnapshot.answers || []),
        { username: user.email, answer, timestamp: Timestamp.now() },
      ];

      await updateDoc(questionRef, { answers: updatedAnswers });

      setAnswer("");
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleAnswers = (id) => {
    setActiveQuestionId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="post-screen">
      {user ? (
        <div className="welcome-section">
          <h1>Welcome, {user.email}</h1>
          <button onClick={() => signOut(auth)} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => (window.location.href = "/login")}
          className="login-button"
        >
          Login to Ask a Question
        </button>
      )}

      <div className="ask-question">
        <h2>Ask a Question</h2>
        <textarea
          placeholder="What's your question?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button onClick={handleAskQuestion} className="ask-button">
          Post Question
        </button>
      </div>

      <div className="questions-section">
        <h2>Questions</h2>
        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <div className="question-header" onClick={() => toggleAnswers(q.id)}>
              <h3>{q.question}</h3>
              <p>
                Asked by: {q.username} on{" "}
                {q.timestamp?.toDate().toLocaleString()}
              </p>
            </div>
            {activeQuestionId === q.id && (
              <div className="answers-section">
                <h4>Answers:</h4>
                {q.answers?.map((ans, index) => (
                  <div key={index} className="answer">
                    <p>
                      <strong>{ans.username}</strong>: {ans.answer}
                    </p>
                  </div>
                ))}
                <textarea
                  placeholder="Write your answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <button
                  onClick={() => handleAnswer(q.id)}
                  className="answer-button"
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostScreen;
