import { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Feed from './components/Feed/Feed';
import SignIn from './components/SignIn/SignIn';
import Submission from './components/Submission/Submission';
import Account from './components/Account/Account';
import { Container } from '@mui/material';
import SearchPage from './components/SearchPage/SearchPage';
import RatingHistory from './components/RatingHistory/RatingHistory';

const App = () => {
  // react hook to keep track of the user's authentication status
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  return (
      <Container className="app-background" maxWidth="sm" disableGutters>
        <Router>
          <Routes>
            {/* comment the following line during development */}
            <Route path="/" element={<SignIn setUser={setUser} setUserEmail={setUserEmail} setProfilePic={setProfilePic}/>} />

            {/* uncomment the following line during development */}
            {/* <Route path="/" element={<Feed />} /> */}

            {/* comment the following line during development */}
            {/* logic to protect from seeing feed without logging in */}
            <Route path="/feed" element={user ? <Feed /> : <Navigate to="/" />} />
            <Route path="/submission" element={user ? <Submission userName={user}/> : <Navigate to="/" />} />
            <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/" />} />
            <Route path="/account" element={user ? <Account userName={user} userEmail={userEmail} profilePic={profilePic} /> : <Navigate to="/" />} />
            <Route path="/rating-history" element={user ? <RatingHistory userName={user} /> : <Navigate to="/" />} />
          </Routes>
        </Router>
    </Container>
  );
};

export default App;
