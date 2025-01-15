import { signInWithGooglePopup } from "../../utilities/firebase";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import logo from "../../images/CBLogo.png";
import { Container } from '@mui/material';

const SignIn = ({ setUser, setUserEmail, setProfilePic }) => {
  const navigate = useNavigate();

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      setUser(response.user);
      setUserEmail(response.user.email);
      setProfilePic(response.user.photoURL);
      // console.log("HI", response.user.photoURL);
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
