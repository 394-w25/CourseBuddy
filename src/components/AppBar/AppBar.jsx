import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import "./AppBar.css";

function AppBar() {
  const location = useLocation();
  const navigate = useNavigate();

  let title = "CourseBuddy";
  let showBackButton = false;
  let showMyFriendsIcon = false;

  if (location.pathname.startsWith('/feed')) {
    title = "CourseBuddy";
  } else if (location.pathname.startsWith('/submission')) {
    title = "New Review";
  } else if (location.pathname.startsWith('/account')) {
    title = "My Account";
  } else if (location.pathname.startsWith('/search')) {
    title = "Friends";
    showMyFriendsIcon = true;
  }

  if (location.pathname === '/my-friends') {
    title = "My Friends";
    showBackButton = true;
    showMyFriendsIcon = false;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleMyFriendsClick = () => {
    navigate('/my-friends');
  };

  return (
    <div className="app-bar">
      {showBackButton && (
        <button className="icon-button" onClick={handleBackClick}>
          <ArrowBackIcon />
        </button>
      )}
      <h1 className="app-bar-title">{title}</h1>

      {showMyFriendsIcon && (
        <button className="icon-button" onClick={handleMyFriendsClick}>
          <PeopleAltIcon />
        </button>
      )}
    </div>
  );
}

export default AppBar;
