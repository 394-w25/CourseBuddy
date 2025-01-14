import { signInWithGooglePopup, auth } from "../../utilities/firebase";
import { useNavigate } from "react-router-dom";
import { Container } from '@mui/material';
import "./SignIn.css";
import logo from "../../images/CBLogo.png";

const SignIn = ({setUser, setUserEmail}) => {
    const navigate = useNavigate();
    const logGoogleUser = async () => {
        try{
            const response = await signInWithGooglePopup();

            console.log("User signed in: ", response.user);
            console.log("User display name: ", response.user.displayName);
            console.log("User email: ", response.user.email);
            // update the user state in App.jsx
            setUser(response.user);
            setUserEmail(response.user.email);
            // redirect to the feed page
            navigate("/feed");
        }
        catch(error) {
            console.error("Error signing in with Google: ", error);
        }
    }
    return (
        <div>
            <img className="logo" src={logo} alt="CourseBuddy Logo" />
            <h1>Welcome to CourseBuddy!</h1>
            {/* TODO: this is just a very ugly buttom, need to make it look better */}
            <button className="signin-button" onClick={logGoogleUser}>Sign in with Google</button>
        </div>
    );
};

export default SignIn;
