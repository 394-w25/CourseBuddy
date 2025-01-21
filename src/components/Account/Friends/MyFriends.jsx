import React from 'react';
import { List, ListItem, ListItemText, Button, Container } from '@mui/material';
import { removeFriend } from '../../../services/friendService';
import AppBar from '../../AppBar/AppBar';
import NavigationBar from '../../NavigationBar/NavigationBar';
import "./Friends.css";

function MyFriends({ user, friends, loadFriends }) {
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
