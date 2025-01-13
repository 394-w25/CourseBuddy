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
import Submission from './components/Submission/Submission';
import Account from './components/Account/Account';
import { Container } from '@mui/material';

const App = () => {
  // react hook to keep track of the user's authentication status
  const [user, setUser] = useState(null);

  return (
      <Container className="app-background" maxWidth="sm" disableGutters>
        <Router>
          <Routes>
            {/* comment the following line during development */}
            <Route path="/" element={<SignIn setUser={setUser}/>} />

            {/* uncomment the following line during development */}
            {/* <Route path="/" element={<Feed />} /> */}

            {/* comment the following line during development */}
            {/* logic to protect from seeing feed without logging in */}
            <Route path="/feed" element={user ? <Feed /> : <Navigate to="/" />} />
            <Route path="/submission" element={user ? <Submission /> : <Navigate to="/" />} />
            <Route path="/account" element={user ? <Account /> : <Navigate to="/" />} />
          </Routes>
        </Router>
    </Container>
  );
};

export default App;
