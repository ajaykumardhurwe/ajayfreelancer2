import React, { useState, useEffect } from 'react';
import '../styles/Home.css'////; // Import CSS for styling
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { app } from '../services/firebaseConfig'; // Firebase configuration file
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const db = getFirestore(app);

const HomePage = () => {
    const [containers, setContainers] = useState([]);
    const [newContainer, setNewContainer] = useState({ media: [] });
    const [mediaInput, setMediaInput] = useState({ type: 'image', url: '', title: '', description: '' });

    useEffect(() => {
        fetchContainers();
    }, []);

    const fetchContainers = async () => {
        try {
            const containerCollection = collection(db, 'containers');
            const containerSnapshot = await getDocs(containerCollection);
            const containerList = containerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContainers(containerList);
        } catch (error) {
            console.error("Error fetching containers:", error);
        }
    };

    const handleAddMediaToContainer = () => {
        const { url, title, description } = mediaInput;
        if (!url.trim()) {
            alert('Please provide a valid URL.');
            return;
        }
        setNewContainer({ 
            ...newContainer, 
            media: [...newContainer.media, { ...mediaInput }] 
        });
        setMediaInput({ type: 'image', url: '', title: '', description: '' });
    };

    const handleAddContainer = async () => {
        if (newContainer.media.length === 0) {
            alert('Please add at least one media item.');
            return;
        }
        try {
            await addDoc(collection(db, 'containers'), newContainer);
            fetchContainers();
            setNewContainer({ media: [] });
        } catch (error) {
            console.error("Error adding container:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'containers', id));
            fetchContainers();
        } catch (error) {
            console.error("Error deleting container:", error);
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    return (
        <div className="home-page">
            <div className="add-container">
                <select 
                    value={mediaInput.type} 
                    onChange={(e) => setMediaInput({ ...mediaInput, type: e.target.value })}
                    className="media-select"
                >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter media URL"
                    value={mediaInput.url}
                    onChange={(e) => setMediaInput({ ...mediaInput, url: e.target.value })}
                    className="media-input"
                />
                <input
                    type="text"
                    placeholder="Enter title"
                    value={mediaInput.title}
                    onChange={(e) => setMediaInput({ ...mediaInput, title: e.target.value })}
                    className="media-input"
                />
                <input
                    type="text"
                    placeholder="Enter description"
                    value={mediaInput.description}
                    onChange={(e) => setMediaInput({ ...mediaInput, description: e.target.value })}
                    className="media-input"
                />
                <button onClick={handleAddMediaToContainer} className="button add-button">Add to Container</button>
                <button onClick={handleAddContainer} className="button add-button">Save Container</button>
            </div>

            {containers && containers.length > 0 ? (
                containers.map((container) => (
                    <div className="container" key={container.id}>
                        {container.media && container.media.length > 0 && (
                            <Slider {...sliderSettings} className="media-slider">
                                {container.media.map((item, i) => (
                                    <div key={i} className="media-item">
                                        {item.type === 'image' ? (
                                            <img src={item.url} alt={item.title} className="media" />
                                        ) : (
                                            <video src={item.url} controls className="media"></video>
                                        )}
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>

                                    </div>
                                ))}
                            </Slider>
                        )}

                        <div className="buttons">
                            <button className="button">
                                <Link to="/payment" >Pay</Link>
                           </button>
                            <button onClick={() => window.open('tel:+919406362538')} className="button">
                                Call Now
                            </button>
                            <button  className="button delete-button">
                                
                            </button>



                            {/* <button onClick={() => handleDelete(container.id)} className="button delete-button">
                                Delete
                            </button> */}

                        </div>
                    </div>
                ))
            ) : (
                <p>No containers available.</p>
            )}
        </div>
    );
};

export default HomePage;

