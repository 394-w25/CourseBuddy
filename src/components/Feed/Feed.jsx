import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import NavigationBar from '../NavigationBar/NavigationBar';
import { Container, Box, Stack } from '@mui/material';
import { collection, getDocs } from "firebase/firestore"; 
import {db} from "../../utilities/firebase";
import "./Feed.css";

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
  const [posts, setPosts] = useState([]);
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
      <Container maxWidth="sm">
        <Box paddingBottom="30px">
          <Stack spacing={3}>
              { posts.length === 0 ?
                (<p>Loading posts...</p>) :
                  (posts.map((post) => 
                    <div key={post.id}>
                      <Post post={post} friends={fake_friends} />
                    </div>)
                  )
              }
          </Stack>
        </Box>
      </Container>
    <NavigationBar />
    </div>
  )
};

export default Feed;