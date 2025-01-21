import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Container } from '@mui/material';
import { fetchUserFriends, removeFriend } from '../../../services/friendService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../utilities/firebase';
import AppBar from '../../AppBar/AppBar';
import NavigationBar from '../../NavigationBar/NavigationBar';
import "./Friends.css";

function MyFriends({ user, friends, setFriends }) {

  useEffect(() => {
    if (!user) return;
    loadFriends();
  }, [user]);

  const loadFriends = async () => {
    const friendIds = await fetchUserFriends(user.uid);
    const friendProfiles = await Promise.all(friendIds.map(async (fid) => {
      const ref = doc(db, 'users', fid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return { id: fid, ...snap.data() };
      } else {
        return { id: fid, displayName: 'Unknown', email: null };
      }
    }));
    setFriends(friendProfiles);
  };

  const handleUnfriend = async (friendId) => {
    await removeFriend(user.uid, friendId);
    await loadFriends();
  };

  return (
    <div>
      <AppBar />
      <Container className="my-friends-page">
        <h2>My Friends</h2>
        <List>
          {friends.length === 0 && <p>You have no friends yet.</p>}
          {friends.map((friend) => (
            <ListItem key={friend.id}>
              <ListItemText
                primary={friend.displayName || 'Unknown'}
                secondary={friend.email || friend.id}
              />
              <Button variant="outlined" onClick={() => handleUnfriend(friend.id)}>Unfriend</Button>
            </ListItem>
          ))}
        </List>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default MyFriends;
