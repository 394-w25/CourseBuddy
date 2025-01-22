// UserItem.jsx
import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Button } from '@mui/material';
import "./UserItem.css";

function UserItem({
  avatarURL,
  primaryText,
  secondaryText,
  mainButtonLabel,
  onMainButtonClick,
  showMainButton = true,
  divider = false,
  children
}) {
  return (
    <ListItem divider={divider} className="user-item">
      <ListItemAvatar>
        <Avatar className="user-item-avatar" src={avatarURL} />
      </ListItemAvatar>
      <ListItemText
        primary={primaryText}
        secondary={secondaryText}
      />
      {showMainButton && (
        <Button color="primary" variant="outlined" onClick={onMainButtonClick}>
          {mainButtonLabel}
        </Button>
      )}
      {children}
    </ListItem>
  );
}

export default UserItem;
