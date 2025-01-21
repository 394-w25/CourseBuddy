// App.js
import React, { useState, useEffect } from 'react';
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
import Feed from './components/Feed/Feed';
import Submission from './components/Submission/Submission';
import Account from './components/Account/Account';
import MyFriends from './components/Account/Friends/MyFriends';
import RatingHistory from './components/RatingHistory/RatingHistory';
import Comment from './components/Comment/Comment';
import SearchPage from './components/SearchPage/SearchPage';
import { fetchUserFriends } from './services/friendService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './utilities/firebase';

// Toggle this to `true` in dev if you want to skip sign-in
const DEV_MODE = false;

function App() {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [friends, setFriends] = useState([]);
  const [filteredPost, setFilteredPost] = useState([]);

  const isAuthenticated = DEV_MODE || user;

  const loadFriends = async () => {
    const friendIds = await fetchUserFriends(user.uid);
    const friendProfiles = await Promise.all(friendIds.map(async (fid) => {
      const ref = doc(db, 'users', fid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return { id: fid, ...snap.data() };
      }
      return { id: fid, displayName: 'Unknown', email: null };
    }));
    setFriends(friendProfiles);
  };

  useEffect(() => {
    if (!user) return;
    loadFriends();
  }, [user]);

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
            <Route path="/" element={<Feed friends={friends} />} />
          )}

          {/* Protected routes => must be logged in or dev */}
          <Route
            path="/feed"
            element={isAuthenticated ? <Feed friends={friends} /> : <Navigate to="/" />}
          />
          <Route 
            path="/submission" 
            element={isAuthenticated ? <Submission userName={user} /> : <Navigate to="/" />} 
          />
          <Route path="/search" element={user ? <SearchPage userUID={user.uid} /> : <Navigate to="/" />} />
          <Route
            path="/account"
            element={
              isAuthenticated
                ? <Account 
                    userName={user}
                    userEmail={userEmail}
                    profilePic={profilePic}
                    friends={friends}
                    filteredPost={filteredPost}
                    setFilteredPost={setFilteredPost}
                  />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/my-friends"
            element={
              isAuthenticated
                ? <MyFriends user={user} friends={friends} loadFriends={loadFriends} />
                : <Navigate to="/" />
            }
          />
          <Route
            path="/rating-history"
            element={
              isAuthenticated
                ? <RatingHistory userName={user} profilePic={profilePic} filteredPost={filteredPost}/>
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
