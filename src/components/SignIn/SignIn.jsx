import { signInWithGooglePopup, auth } from "../../utilities/firebase";
import { useNavigate } from "react-router-dom";
import { Container } from '@mui/material';
import "./SignIn.css";
import logo from "../../images/CBLogo.png";

const SignIn = ({setUser}) => {
    const navigate = useNavigate();
    const logGoogleUser = async () => {
        try{
            const response = await signInWithGooglePopup();
            console.log("User signed in: ", response.user);
            // update the user state in App.jsx
            setUser(response.user);
            // redirect to the feed page
            navigate("/feed");
        }
        catch(error) {
            console.error("Error signing in with Google: ", error);
        }
    }
    return (
        <Container className="background" maxWidth="sm">
        <div>
            <img className="logo" src={logo} alt="CourseBuddy Logo" />
            <h1>Welcome to CourseBuddy!</h1>
            {/* TODO: this is just a very ugly buttom, need to make it look better */}
            <button className="signin-button" onClick={logGoogleUser}>Sign in with Google</button>
        </div>
        </Container>
    );
};

export default SignIn;
