import { signInWithGooglePopup, auth } from "../../utilities/firebase";
import { useNavigate } from "react-router-dom";

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
        <div>
            {/* TODO: this is just a very ugly buttom, need to make it look better */}
            <button onClick={logGoogleUser}>Sign in with Google</button>
        </div>
    );
};

export default SignIn;
