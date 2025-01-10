import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './components/Post/Post';
import Feed from './components/Feed/Feed';
import './firebase';

const App = () => {
  return (
    <div className="App">
      <Feed />
    </div>
  );
};

export default App;
