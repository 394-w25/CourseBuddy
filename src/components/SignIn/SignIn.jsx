import { signInWithGooglePopup } from "../../utilities/firebase";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import logo from "../../images/CBLogo.png";

const SignIn = ({ setUser }) => {
  const navigate = useNavigate();

  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopup();
      console.log("User signed in: ", response.user);
      console.log("User display name: ", response.user.displayName);
      console.log("User email: ", response.user.email);      setUser(response.user);
      navigate("/feed");
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-card">
        <img className="logo" src={logo} alt="CourseBuddy Logo" />
        <button className="signin-button" onClick={logGoogleUser}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
