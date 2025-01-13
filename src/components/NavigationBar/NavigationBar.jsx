import React from 'react';
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RestoreIcon from '@mui/icons-material/Restore';
import PublishIcon from '@mui/icons-material/Publish';
import { Link } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar() {
    return (
        <BottomNavigation className="nav-bar" showLabels>
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} component={Link} to="/feed" />
        <BottomNavigationAction label="Post" icon={<PublishIcon />} component={Link} to="/submission" />
        <BottomNavigationAction label="My Account" icon={<AccountCircleIcon />} component={Link} to="/account" />
        </BottomNavigation>
      );
};

export default NavigationBar;