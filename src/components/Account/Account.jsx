// Account.jsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../utilities/firebase';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import "./Account.css";

function Account({
  userName,
  userEmail,
  profilePic,
  filteredPost,
  likedPosts,
}) {
  const navigate = useNavigate();
  const [friendCount, setFriendCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const signOut = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!userName?.uid) return;
    const unsub = onSnapshot(doc(db, "users", userName.uid), snap => {
      if (!snap.exists()) return;
      const data = snap.data() || {};
      const arr = data.friends || [];
      setFriendCount(arr.length);
    });
    return () => unsub();
  }, [userName]);

  // Checks posts database to find the number of user posts
  useEffect(() => {
    if (!userName?.displayName) return;

    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), where("username", "==", userName.displayName)),
      (snapshot) => {
        setReviewCount(snapshot.size); 
      },
      (error) => {
        console.error("Error fetching user reviews:", error);
      }
    );

    return () => unsubscribe();
}, [userName]);

  return (
    <div className="account-page">
      <AppBar />
      <Container maxWidth="sm" className="account-container">
        <div className="account-top-card">
          <div className="top-card-row">
            <Avatar src={profilePic} className="account-avatar" />
            <div className="stats-right">
              <div
                className="stat-block"
                onClick={() => navigate('/rating-history')}
              >
                <span className="stat-number">{reviewCount}</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div
                className="stat-block"
                onClick={() => navigate('/my-friends')}
              >
                <span className="stat-number">{friendCount}</span>
                <span className="stat-label">Friends</span>
              </div>
            </div>
          </div>

          <div className="user-info-section">
            <Typography className="user-name">
              {userName?.displayName || "Unknown User"}
            </Typography>
            <Typography className="user-email">
              {userEmail || "No email available"}
            </Typography>
          </div>
        </div>

        <Button
          variant="contained"
          className="liked-reviews-btn"
          endIcon={<FavoriteBorderIcon />}
          onClick={() => navigate('/liked-reviews')}
        >
          Liked Reviews
        </Button>

        <Button
          variant="contained"
          color="error"
          className="signout-btn"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default Account;
