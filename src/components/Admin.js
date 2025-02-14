// import React from 'react';
// import MCQTestScreen from './CMCQTestScreen';
// import CPost from './CPost';
// import CClassScreen from './CClassScreen';
// import CHome from './CHome'
// import CEnglishClass from './CEnglishClass'
// import CDownload from './CDownload'
// import CSquareBox from './CSquareBox'
// import UploadMcq from './UploadMcq'
// const Contact = () => {
//   return (
//     <div className="content">
//       <h1>Hello Ajay</h1>
// <h1>This is Home Screen</h1>
// <CHome></CHome>
//       <h1>This is MCQTestScreen</h1>

//       <MCQTestScreen></MCQTestScreen>
//       <h1>This is PostScreen</h1>
// <CPost></CPost>
// <h1>This is ClassScreen</h1>
// <CClassScreen></CClassScreen>
// <h1>This is EnglishClassScreen</h1>
// <CEnglishClass></CEnglishClass>
// <h1>This is EnglishClassScreen</h1>
// <CDownload></CDownload>
// <h1>SquareBox</h1>
// <CSquareBox></CSquareBox>
// <h1>for Questions Upload</h1>
// <UploadMcq></UploadMcq>
//       <p></p>
//     </div>
//   );
// };

// export default Contact;













import React, { useState } from 'react';
import MCQTestScreen from './CMCQTestScreen';
import CPost from './CPost';
import CClassScreen from './CClassScreen';
import CHome from './CHome';
import CEnglishClass from './CEnglishClass';
import CDownload from './CDownload';
import CSquareBox from './CSquareBox';
import UploadMcq from './UploadMcq';
import '../styles/Admin.css'
const Contact = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const correctPassword = 'Ajay9301084259'; // Replace with your desired password
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="password-protect">
        <h1>Password Protected</h1>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Submit</button>
      </div>
    );
  }

  return (
    <div className="content">
      <h1>Hello Ajay</h1>
      <h1>This is Home Screen</h1>
      <CHome />
      <h1>This is MCQTestScreen</h1>
      <MCQTestScreen />
      <h1>This is PostScreen</h1>
      <CPost />
      <h1>This is ClassScreen</h1>
      <CClassScreen />
      <h1>This is EnglishClassScreen</h1>
      <CEnglishClass />
      <h1>This is Download Screen</h1>
      <CDownload />
      <h1>SquareBox</h1>
      <CSquareBox />
      <h1>For Questions Upload</h1>
      <UploadMcq />
      <p></p>
    </div>
  );
};

export default Contact;
