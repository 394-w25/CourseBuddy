import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import PublishIcon from '@mui/icons-material/Publish';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { collection, getDocs } from "firebase/firestore"; 
import "./Feed.css";
import { useNavigate } from "react-router-dom";
import {db} from "../../utilities/firebase";
import { set } from 'firebase/database';

const fake_post = {
    id: 1, // automatically assigned
    title: "I LOVE CS394",
    course_name: "CS 394",
    username: "john12nu", // no need to fill this out in the submission form
    quarter: "Fall 2024",
    body: "I had such an amazing time taking CS394. Highly recommend!",
    rating: "5",
    professor: "Prof. Riesbeck",
    date: "January 10th, 2024", // use JS object to retrieve the date posted
};

async function getPostsFromDB() {
  // get all the posts from the database
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts = [];
  querySnapshot.forEach((doc) => {
      posts.push({id: doc.id, ...doc.data()});
  });
  return posts;
}

const fake_friends = ["Alice", "Bob", "Charlie", "David"];

function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState(0);
  // useEffect runs every time the component is rendered
  useEffect(() => {
    // wait for all posts from database to be fetched
    async function fetchPosts() {
      try {
        const fetchedPosts = await getPostsFromDB();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div>
        <Container className="feed-screen" maxWidth="sm">
          { posts.length === 0 ?
            (<p>Loading posts...</p>) :
            (
              (posts.map((post) => {
                return (<div key={post.id}>
                  <Post post={post} friends={fake_friends} />
                  <br />
                </div>)
              }))
            ) }
        </Container>

        <Box className="navbar" sx={{ width: 500 }}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              if (newValue === 0) {
                navigate("/feed");
              } else if (newValue === 1) {
                navigate("/submission");
              } else {
                navigate("/account");
              }
            }}
          >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Post" icon={<PublishIcon />} />
            <BottomNavigationAction label="My Account" icon={<AccountCircleIcon />} />
          </BottomNavigation>
        </Box>
    </div>
  )
};

export default Feed;