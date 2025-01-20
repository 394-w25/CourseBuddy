import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';

function UserItem({ 
  username, 
  message, 
  isFollowing, 
  onFollowToggle 
}) {
  return (
    <ListItem divider>
      <ListItemAvatar>
        <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={username}
        secondary={message}
      />

      <Button
        variant="contained"
        color={isFollowing ? "primary" : "secondary"}
        onClick={onFollowToggle}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
    </ListItem>
  );
}

export default UserItem;
