// MyFriends.jsx
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Container } from '@mui/material';
import { fetchUserFriends, removeFriend } from '../../../services/friendService';
import AppBar from '../../AppBar/AppBar';
import NavigationBar from '../../NavigationBar/NavigationBar';

function MyFriends({ user }) {
  const [friendIds, setFriendIds] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function loadFriends() {
      const f = await fetchUserFriends(user.uid);
      setFriendIds(f);
    }
    loadFriends();
  }, [user]);

  const handleUnfriend = async (friendId) => {
    await removeFriend(user.uid, friendId);
    const updated = await fetchUserFriends(user.uid);
    setFriendIds(updated);
  };

  return (
    <div>
      <AppBar />
      <Container style={{ paddingTop: '20px', height: '100vh' }}>
        <h2>My Friends</h2>

        <List>
          {friendIds.length === 0 && <p>You have no friends yet.</p>}
          {friendIds.map((fid) => (
            <ListItem key={fid}>
              <ListItemText primary={`Friend ID: ${fid}`} />
              <Button variant="outlined" onClick={() => handleUnfriend(fid)}>
                Unfriend
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default MyFriends;
