
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faQuestionCircle, faQuestion, faSearch, faUser, faPlusCircle, faCompass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../styles/BottomTab.css';

const BottomTab = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="bottom-tab">
      <Link
        to="/"
        className={activeTab === 'home' ? 'active' : ''}
        onClick={() => setActiveTab('home')}
      >
        <FontAwesomeIcon icon={faHome} />
      </Link>

      <Link
        to="/mcqtestscreen"
        className={activeTab === 'search' ? 'active' : ''}
        onClick={() => setActiveTab('search')}
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
      </Link>

      <Link
        to="/post"
        className={activeTab === 'post' ? 'active' : ''}
        onClick={() => setActiveTab('post')}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
      </Link>

      <Link
        to="/classes"
        className={activeTab === 'classes' ? 'active' : ''}
        onClick={() => setActiveTab('classes')}
      >
        <FontAwesomeIcon icon={faCompass} />
      </Link>

      <Link
        to="/profile"
        className={activeTab === 'profile' ? 'active' : ''}
        onClick={() => setActiveTab('profile')}
      >
        <FontAwesomeIcon icon={faUser} />
      </Link>
    </div>
  );
};

export default BottomTab;
