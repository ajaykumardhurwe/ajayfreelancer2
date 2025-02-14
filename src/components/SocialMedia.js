import React from 'react';
import { db } from '../services/firebaseConfig';

import { collection, doc, getDoc, increment, setDoc } from 'firebase/firestore';
import {
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from 'react-icons/fa';
import '../styles/SocialMedia.css';

const SocialMedia = () => {
  const platforms = [
    { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://www.linkedin.com' },
   
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://www.instagram.com/ajay_dhurwe_750' },
    { name: 'Facebook', icon: <FaFacebook />, url: 'https://www.facebook.com/a.j.a.y.d.h.u.r.w.e.7.5.0.A/' },
    { 
      name: 'WhatsApp', 
      icon: <FaWhatsapp />, 
      url: 'https://wa.me/+919301084259?text=Hello!%20I%20would%20like%20to%20connect.' // Replace 1234567890 with your phone number
    },
    { name: 'Twitter', icon: <FaTwitter />, url: 'https://www.twitter.com' },
    // { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://www.linkedin.com' },
    { name: 'GitHub', icon: <FaGithub />, url: 'https://github.com/ajaykumardhurwe' },
  ];

  const handleLinkClick = async (platform) => {
    const docRef = doc(collection(db, 'clicks'), platform.name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { count: increment(1) }, { merge: true });
    } else {
      await setDoc(docRef, { count: 1 });
    }
  };

  return (
    <div className="social-media">
      <h1>Social Media Platforms</h1>
      <ul>
        {platforms.map((platform) => (
          <li key={platform.name}>
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(platform)}
            >
              <span className="icon">{platform.icon}</span>
              <span className="name">{platform.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMedia;
