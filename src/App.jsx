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
import MyFriends from './components/SearchPage/MyFriends/MyFriends';
import RatingHistory from './components/RatingHistory/RatingHistory';
import Comment from './components/Comment/Comment';
import SearchPage from './components/SearchPage/SearchPage';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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

  useEffect(() => {
    if (!user) return;
  
    const userRef = doc(db, "users", user.uid);
  
    const unsubscribe = onSnapshot(userRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const friendIds = data.friends || [];
  
        if (friendIds.length === 0) {
          setFriends([]);
          return;
        }
  
        // Fetch each friend's details from the users collection
        const friendProfiles = await Promise.all(
          friendIds.map(async (friendId) => {
            const friendRef = doc(db, 'users', friendId);
            const friendSnap = await getDoc(friendRef);
  
            if (friendSnap.exists()) {
              const friendData = friendSnap.data();
              return {
                id: friendId,
                displayName: friendData.displayName || "Unknown",
                email: friendData.email || "No email available",
                photoURL: friendData.photoURL || "",
              };
            } else {
              return { id: friendId, displayName: "Unknown", email: "No email available", photoURL: "" };
            }
          })
        );
  
        setFriends(friendProfiles);
      } else {
        console.error("User document does not exist.");
      }
    });
  
    return () => unsubscribe();
  }, [user]);
  

  return (
    <Container className="app-background" maxWidth="sm" disableGutters>
      <Router>
        <Routes>
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

          <Route path="/feed" element={isAuthenticated ? <Feed friends={friends} /> : <Navigate to="/" />} />
          <Route path="/submission" element={isAuthenticated ? <Submission userName={user} /> : <Navigate to="/" />} />
          <Route path="/search" element={user ? <SearchPage userUID={user.uid} /> : <Navigate to="/" />} />
          <Route 
            path="/account" 
            element={isAuthenticated ? 
              <Account 
                userName={user}
                userEmail={userEmail}
                profilePic={profilePic}
                friends={friends}
                filteredPost={filteredPost}
                setFilteredPost={setFilteredPost} 
              /> 
              : <Navigate to="/" />} 
          />
          <Route path="/my-friends" element={isAuthenticated ? <MyFriends user={user} friends={friends} /> : <Navigate to="/" />} />
          <Route path="/rating-history" element={isAuthenticated ? <RatingHistory userName={user} profilePic={profilePic}/> : <Navigate to="/" />} />
          <Route path="/comment/:post_id" element={isAuthenticated ? <Comment userName={user} profilePic={profilePic} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
