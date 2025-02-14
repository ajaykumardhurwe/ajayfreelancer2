// import React from 'react';

// const Explorer = () => {
//   return <h1>Explorer Page</h1>;
// };

// export default Explorer;


// // /src/YouTubeShortsPlayer.js
// import React, { useState, useEffect } from "react";
// import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
// import ReactPlayer from "react-player";
// // import db from "../services/firebaseConfig";
// import { db } from '../services/firebaseConfig';

// import "../styles/VideoPlayer.css";

// const YouTubeShortsPlayer = () => {
//   const [videoId, setVideoId] = useState("");
//   const [videoList, setVideoList] = useState([]);
//   const [currentVideo, setCurrentVideo] = useState(null);

//   // Fetch video IDs from Firestore
//   const fetchVideos = async () => {
//     const videosCollection = collection(db, "videos");
//     const snapshot = await getDocs(videosCollection);
//     const videos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     setVideoList(videos);
//   };

//   // Add a new video to Firestore
//   const addVideo = async () => {
//     if (!videoId.trim()) return;
//     const videosCollection = collection(db, "videos");
//     await addDoc(videosCollection, { videoId });
//     setVideoId(""); // Clear input
//     fetchVideos();
//   };

//   // Delete a video from Firestore
//   const deleteVideo = async (id) => {
//     const videoDoc = doc(db, "videos", id);
//     await deleteDoc(videoDoc);
//     fetchVideos();
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   return (
//     <div className="shorts-container">
//       <div className="form-container">
//         <input
//           type="text"
//           placeholder="Enter YouTube Video ID"
//           value={videoId}
//           onChange={(e) => setVideoId(e.target.value)}
//         />
//         <button onClick={addVideo}>Add Video</button>
//       </div>

//       <div className="video-list">
//         {videoList.map((video) => (
//           <div key={video.id} className="video-item">
//             <p>Video ID: {video.videoId}</p>
//             <button onClick={() => setCurrentVideo(video.videoId)}>Play</button>
//             <button onClick={() => deleteVideo(video.id)}>Delete</button>
//           </div>
//         ))}
//       </div>

//       {currentVideo && (
//         <div className="player-wrapper">
//           <ReactPlayer
//             url={`https://www.youtube.com/embed/${currentVideo}`}
//             playing
//             controls
//             loop
//             width="100%"
//             height="100%"
//             className="player"
//             config={{
//               youtube: {
//                 playerVars: {
//                   modestbranding: 1,
//                   showinfo: 0,
//                   rel: 0,
//                 },
//               },
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default YouTubeShortsPlayer;















// /src/VideoManager.js
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import db from "../services/firebaseConfig";
import { db } from '../services/firebaseConfig';

// import "../styles/VideoPlayer.css";

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeId: "",
  });

  // Fetch videos from Firestore
  const fetchVideos = async () => {
    const videosCollection = collection(db, "videos");
    const snapshot = await getDocs(videosCollection);
    const fetchedVideos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setVideos(fetchedVideos);
  };

  // Add a new video to Firestore
  const addVideo = async () => {
    if (!formData.title || !formData.description || !formData.youtubeId) return;

    const videosCollection = collection(db, "videos");
    await addDoc(videosCollection, formData);

    setFormData({ title: "", description: "", youtubeId: "" });
    fetchVideos();
  };

  // Delete a video from Firestore
  const deleteVideo = async (id) => {
    const videoDoc = doc(db, "videos", id);
    await deleteDoc(videoDoc);
    fetchVideos();
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="video-manager">
      {/* Add Video Form */}
      <div className="form-container">
        <h2>Add New Video</h2>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="YouTube Video ID"
          value={formData.youtubeId}
          onChange={(e) =>
            setFormData({ ...formData, youtubeId: e.target.value })
          }
        />
        <button onClick={addVideo}>Add Video</button>
      </div>

      {/* Video List */}
      <div className="video-list">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <img
              src={`https://img.youtube.com/vi/${video.youtubeId}/0.jpg`}
              alt={video.title}
              className="video-thumbnail"
            />
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <button onClick={() => deleteVideo(video.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoManager;
