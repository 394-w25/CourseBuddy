import { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Feed from './components/Feed/Feed';
import SignIn from './components/SignIn/SignIn';

const App = () => {
  // react hook to keep track of the user's authentication status
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* comment the following line during development */}
        {/* <Route path="/" element={<SignIn setUser={setUser}/>} /> */}
        {/* uncomment the following line during development */}
        <Route path="/" element={<Feed />} />
        {/* comment the following line during development */}
        {/* logic to protect malicious people from seeing feed without logging in */}
        {/* <Route path="/feed" element={user ? <Feed /> : <Navigate to="/" />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
