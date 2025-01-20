// App.js
import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Container } from '@mui/material';

// Pages & Components
import SignIn from './components/SignIn/SignIn';
import PublicFeed from './components/PublicFeed/PublicFeed';
import Feed from './components/Feed/Feed';
import Submission from './components/Submission/Submission';
import Account from './components/Account/Account';
import FriendRequests from './components/Account/Friends/FriendRequests';
import MyFriends from './components/Account/Friends/MyFriends';
import RatingHistory from './components/RatingHistory/RatingHistory';
import Comment from './components/Comment/Comment';

// Toggle this to `true` in dev if you want to skip sign-in
const DEV_MODE = false;

function App() {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const isAuthenticated = DEV_MODE || user;

  return (
    <Container className="app-background" maxWidth="sm" disableGutters>
      <Router>
        <Routes>
          {/* Root => sign in if not dev mode */}
          {!DEV_MODE ? (
            <Route
              path="/"
              element={
                <SignIn
                  setUser={setUser}
                  setUserEmail={setUserEmail}
                  setProfilePic={setProfilePic}
                />
              }
            />
          ) : (
            <Route path="/" element={<Feed />} />
          )}

          {/* Protected routes => must be logged in or dev */}
          <Route
            path="/public"
            element={isAuthenticated ? <PublicFeed /> : <Navigate to="/" />}
          />
          <Route
            path="/feed"
            element={isAuthenticated ? <Feed /> : <Navigate to="/" />}
          />
          <Route 
            path="/submission" 
            element={isAuthenticated ? <Submission userName={user} /> : <Navigate to="/" />} 
          />
          <Route
            path="/account"
            element={
              isAuthenticated
                ? <Account 
                    userName={user}
                    userEmail={userEmail}
                    profilePic={profilePic}
                  />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/friend-requests"
            element={
              isAuthenticated
                ? <FriendRequests user={user} />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/my-friends"
            element={
              isAuthenticated
                ? <MyFriends user={user} />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/rating-history"
            element={
              isAuthenticated
                ? <RatingHistory userName={user} profilePic={profilePic} />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/comment/:post_id"
            element={
              isAuthenticated
                ? <Comment userName={user} profilePic={profilePic} />
                : <Navigate to="/" />
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
