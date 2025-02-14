// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//      <h1>Hello world</h1>
//       </header>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Drawer from './components/Drawer';
import BottomTab from './components/BottomTab';
import CrudOperations from './components/CrudOperations';
import About from './components/About'
import Services from './components/Services';
import Contact from './components/Contact';
import SocialMedia from './components/SocialMedia';
import Search from './components/Search';
import Post from './components/Post';
import Explorer from './components/Explorer';
import Profile from './components/Profile';
import Download from './components/Download';
import Class from './components/ClassScreen';
import SignUpPage from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import GoogleSignInPage from './components/GoogleSignInPage';
import Login from './components/Login';
import MCQTest from './components/MCQTest';
import Result from './components/Result';
import Auth from './components/Auth';
import Backup from './components/Backup';
import Home from './components/Home';
import Payment from './components/Payment';
import ClassScreen from './components/ClassScreen';
import ClassDetail2 from './components/ClassDetails2';
// import './App.css';
import MCQTestScreen from './components/MCQTestScreen';
import EnglishClass from './components/EnglishClass';
import CgpscMcq from './components/CgpscMcq';
import Admin from './components/Admin'
import IndianConstitutionMcq from './components/IindianConstitutionMcq';
import SquareBox from './components/SquareBox'
import DetailsPage from './components/DetailsPage';
import UploadMcq from './components/UploadMcq'
import CodePlayground from './components/CodePlayground';
import PrivacyPolicy from './components/PrivacyPolicy';
// import UploadMcq from './components/UploadMcq'
import CMCQTestScreen from './components/CMCQTestScreen'
const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Navbar />
        <Drawer />

        <main className="main-content">
          <Routes>
            {/* <Route path="/" element={<CrudOperations />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About></About>}></Route>
            {/* <Route path="/srccode" element={<CodePlayground></CodePlayground>}/> */}
            <Route path="/srccode" element={<UploadMcq></UploadMcq>}/>
 
            <Route path='/contact' element={<Contact></Contact>}/>
            <Route path='/test' element={<MCQTest></MCQTest>}/>
            <Route path='/post' element={<Post></Post>}/>
            <Route path='/explorer' element={<Explorer></Explorer>}/>
            <Route path='/profile' element={<Profile></Profile>}/>
            <Route path='/download' element={<Download></Download>}/>
            <Route path='/classes' element={<ClassScreen></ClassScreen>}/>
            <Route path='/signup' element={<SignUpPage></SignUpPage>}/>
            <Route path='/signin' element={<SignInPage></SignInPage>}/>
            <Route path='/signin-google' element={<GoogleSignInPage></GoogleSignInPage>}/>
            <Route path='/login' element={<Login></Login>}/>
            <Route path='/admin' element={<Admin></Admin>}/>
            <Route path='/MCQTestScreen' element={<MCQTestScreen></MCQTestScreen>}/>
            <Route path='/result' element={<Result></Result>}/>
            {/* <Route path='/backup' element={<Backup></Backup>}/> */}
            <Route path='/payment' element={<Payment></Payment>}/>
            <Route path='/englishclass' element={<EnglishClass></EnglishClass>}/>
            <Route path="/details/:id" element={<DetailsPage />} />
            <Route path='/privacypolicy' element={<PrivacyPolicy></PrivacyPolicy>}/>
            <Route path='details/n1syfofbUvP6D7GqIFHQ' element={<MCQTest></MCQTest>}/>
            <Route path='testing/' element={<CMCQTestScreen></CMCQTestScreen>}/>
            
            
            <Route path="/project" element={<SquareBox></SquareBox>} />
            <Route path='/socialmedia' element={<SocialMedia></SocialMedia>}/>
            <Route path='/privacypolicy' element={<PrivacyPolicy></PrivacyPolicy>}/>

          </Routes>
        </main>

        <BottomTab />
      </div>


    </Router>
  );
};

export default App;