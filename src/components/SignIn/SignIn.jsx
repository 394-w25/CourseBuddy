import React from 'react';
import "./SignIn.css";
import logo from "../../images/CBLogo.png";
import { Container } from '@mui/material';
import { useNavigate } from "react-router-dom";

import { signInWithGooglePopup } from "../../utilities/firebase";

import { createUserDocIfNotExists } from "../../utilities/createUserDocIfNotExists";

const SignIn = ({ setUser, setUserEmail, setProfilePic }) => {
  const navigate = useNavigate();

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();

      // 1) store user in React state
      setUser(response.user);
      setUserEmail(response.user.email);
      setProfilePic(response.user.photoURL);

      // 2) ensure there's a doc in "users/{uid}"
      await createUserDocIfNotExists(response.user);

      // 3) navigate to feed
      navigate("/feed");
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <Container className="signin-page" maxWidth="sm">
      <img className="logo" src={logo} alt="CourseBuddy Logo" />
      <button className="signin-button" onClick={logGoogleUser}>
        Sign in with Google
      </button>
    </Container>
  );
};

export default SignIn;
