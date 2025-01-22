import React from 'react';
import { List, Container } from '@mui/material';
import { removeFriend } from '../../../utilities/friendService';
import AppBar from '../../AppBar/AppBar';
import NavigationBar from '../../NavigationBar/NavigationBar';
import UserItem from '../UserItem/UserItem';
import "./MyFriends.css";

function MyFriends({ user, friends, setFriends }) {

  const handleUnfriend = async (friendId) => {
    try {
      await removeFriend(user.uid, friendId);
      await removeFriend(friendId, user.uid);

      setFriends((prevFriends) => prevFriends.filter(friend => friend.id !== friendId));
    } catch (error) {
      console.error("Error unfriending user:", error);
    }
  };

  return (
    <div>
      <AppBar />
      <Container className="my-friends-page">
        <h2>My Friends</h2>
        <List>
          {friends.length === 0 ? (
            <p>You have no friends yet.</p>
          ) : (
            friends.map((friend) => (
              <UserItem
                key={friend.id}
                avatarURL={friend.photoURL}
                primaryText={friend.displayName || "Unknown"}
                secondaryText={friend.email || friend.id}
                mainButtonLabel="Unfriend"
                onMainButtonClick={() => handleUnfriend(friend.id)}
                showMainButton
                divider
              />
            ))
          )}
        </List>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default MyFriends;
