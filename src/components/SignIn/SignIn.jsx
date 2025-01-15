import { signInWithGooglePopup } from "../../utilities/firebase";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import logo from "../../images/CBLogo.png";
import { Container } from '@mui/material';

const SignIn = ({ setUser, setUserEmail }) => {
  const navigate = useNavigate();

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      console.log("User signed in: ", response.user);
      console.log("User display name: ", response.user.displayName);
      console.log("User email: ", response.user.email); 
      setUser(response.user);
      setUserEmail(response.user.email);
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
