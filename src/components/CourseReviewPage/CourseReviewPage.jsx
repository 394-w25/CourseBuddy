import React, {useState, useEffect} from 'react';
import "./CourseReviewPage.css";
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import Post from '../Post/Post';
import {Box, Stack, Typography, Container} from '@mui/material';
import { collection, getDocs, query, orderBy } from "firebase/firestore"; 
import { db } from "../../utilities/firebase";

async function getPostsFromDB(courseName) {
    const q = query(collection(db, "posts"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
        if (doc.data().course_name === courseName) {
            posts.push({ id: doc.id, ...doc.data() });
        }
    });
    return posts;
}
  
function CourseReviewPage({user, likedPosts, setLikedPosts}) {
    const [coursePosts, setCoursePosts] = useState([]);
    const courseName = location.pathname.replace(/\/course\/(\D+)(\d+)/, '$1 $2');

    useEffect(() => {
        async function fetchPosts() {
            try {
                const fetchedPosts = await getPostsFromDB(courseName);
                setCoursePosts(fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        }
        fetchPosts();
    }, [user]); 

  return (
    <div>
    <AppBar />

    <Container className="course-reviews-content" maxWidth="sm">
        <Typography variant="h6" align="center" gutterBottom>{courseName} Reviews</Typography>
      <Box>
        <Stack spacing={3}>
            {(
            coursePosts.map((post) => (
              <div key={post.id}>
                <Post
                  post={post}
                  user={user}
                  likedPosts={likedPosts}
                  setLikedPosts={setLikedPosts}
                  isPublic={0}
                />
              </div>
            ))
          )}
        </Stack>
      </Box>
    </Container>

    <NavigationBar />
  </div>
  )
}

export default CourseReviewPage