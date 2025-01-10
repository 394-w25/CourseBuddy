import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './components/Post/Post';

const App = () => {
  const [count, setCount] = useState(0);

  const fake_post = {
    id: 1, // automatically assigned
    title: "I LOVE CS394",
    course_name: "CS 394",
    user_name: "bob", // no need to fill this out in the submission form
    quarter: "Fall 2024",
    comment: "I had such an amazing time taking CS394. Highly recommend!",
    rating: "5/5",
    professor: "Chris Riesbeck",
    date: "January 10th, 2024", // use JS object to retrieve the date posted
  }
  
  const fake_friends = ["Alice", "Bob", "Charlie", "David"];

  return (
    <div className="App">
      <Post post={fake_post} friends={fake_friends}/>
    </div>
  );
};

export default App;
