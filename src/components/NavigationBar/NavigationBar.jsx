import React from 'react';
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RestoreIcon from '@mui/icons-material/Restore';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Link } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar() {
    return (
        <BottomNavigation className="nav-bar" showLabels>
        <BottomNavigationAction label="Feed" icon={<RestoreIcon />} component={Link} to="/feed" />
        <BottomNavigationAction label="Friends" icon={<PersonSearchIcon />} component={Link} to="/search" />
        <BottomNavigationAction label="Post" icon={<RateReviewIcon />} component={Link} to="/submission" />
        <BottomNavigationAction label="My Account" icon={<AccountCircleIcon />} component={Link} to="/account" />
        </BottomNavigation>
      );
};

export default NavigationBar;