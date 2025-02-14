import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import "../styles/PostScreen.css";
import { Button } from "bootstrap";

const PostScreen = () => {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [officialLink, setOfficialLink] = useState("");
  const [notificationLink, setNotificationLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const handlePost = async () => {
    if (!user) {
      alert("Please login to comment!");
      return;
    }

    if (!title.trim() || !imageURL.trim() || !description.trim()) {
      alert("All fields are required!");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        imageURL,
        description,
        officialLink,
        notificationLink,
        startDate,
        lastDate,
        username: user.email,
        comments: [],
        timestamp: Timestamp.now(),
      });

      setTitle("");
      setImageURL("");
      setDescription("");
      setOfficialLink("");
      setNotificationLink("");
      setStartDate("");
      setLastDate("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleComment = async (postId) => {
    if (!user) {
      alert("Please login to comment!");
      return;
    }

    if (!comment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      const post = posts.find((p) => p.id === postId);
      const updatedComments = [
        ...(post.comments || []),
        {
          username: user.email,
          text: comment,
          timestamp: Timestamp.now(),
        },
      ];

      await updateDoc(postRef, { comments: updatedComments });
      setComment("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (postId) => {
    if (!user) {
      alert("Please login to delete posts!");
      return;
    }

    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      alert(error.message);
    }
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
          Login to Create a Post
        </button>
      )}





{/* 
      <div className="create-post">
        <h2>Create a Post</h2>
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Official Link"
          value={officialLink}
          onChange={(e) => setOfficialLink(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notification Link"
          value={notificationLink}
          onChange={(e) => setNotificationLink(e.target.value)}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Last Date"
          value={lastDate}
          onChange={(e) => setLastDate(e.target.value)}
        />
        <button onClick={handlePost} className="post-button">
          Post
        </button>
      </div> */}












      <div className="posts-section">
        {/* <h2>Posts</h2> */}
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <img src={post.imageURL} alt={post.title} className="post-image" />
            <p>{post.description}</p>
            <p>
              <strong>Start Date:</strong> {post.startDate || "N/A"}
            </p>
            <p>
              <strong>Last Date:</strong> {post.lastDate || "N/A"}
            </p>
            <div className="post-buttons">
              <a
                href={post.officialLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="official-link"
              >
                Official Link
              </a>
              <a
                href={post.notificationLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="notification-link"
              >
                Notification Link
              </a>
              <a
                href={`https://wa.me/919301084259?text=Hi, I saw your post titled "${post.title}"`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
              >
                Apply for this Job
              </a>


              {/* <button onClick={() => handleDelete(post.id)} className="delete-button">
                Delete Post
              </button> */}


            </div>
            <p>
              Posted by: {post.username} on{" "}
              {post.timestamp?.toDate().toLocaleString()}
            </p>

            <div className="comments-section">
              <h4>Comments:</h4>
              {post.comments?.map((c, index) => (
                <div key={index} className="comment">
                  <p>
                    <strong>{c.username}</strong>: {c.text}
                  </p>
                  <p>
                    <small>{c.timestamp?.toDate().toLocaleString()}</small>
                  </p>
                </div>
              ))}
              <textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={() => handleComment(post.id)}
                className="comment-button"
              >
                Submit Comment
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default PostScreen;