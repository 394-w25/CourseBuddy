import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import "./AppBar.css";

function AppBar() {
  const location = useLocation();
  const navigate = useNavigate();

  let title = "CourseBuddy";
  let showBackButton = false;
  let showFriendRequestsIcon = false;

  if (location.pathname.startsWith('/feed')) {
    title = "CourseBuddy";
  } else if (location.pathname.startsWith('/submission')) {
    title = "New Review";
  } else if (location.pathname.startsWith('/account')) {
    title = "My Account";
    showFriendRequestsIcon = true;
  }

  if (location.pathname === '/friend-requests') {
    title = "Friend Requests";
    showBackButton = true;
    showFriendRequestsIcon = false;
  } else if (location.pathname === '/my-friends') {
    title = "My Friends";
    showBackButton = true;
    showFriendRequestsIcon = false;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleFriendRequestsClick = () => {
    navigate('/friend-requests');
  };

  return (
    <div className="app-bar">
      {showBackButton && (
        <button className="icon-button" onClick={handleBackClick}>
          <ArrowBackIcon />
        </button>
      )}

      <h1 className="app-bar-title">{title}</h1>

      {showFriendRequestsIcon && (
        <button className="icon-button" onClick={handleFriendRequestsClick}>
          <PersonSearchIcon />
        </button>
      )}
    </div>
  );
}

export default AppBar;
