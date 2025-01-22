import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import NavigationBar from '../NavigationBar/NavigationBar';
import CourseSelect from '../CourseSelect/CourseSelect';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Container, Box, Stack } from '@mui/material';
import { collection, getDocs } from "firebase/firestore"; 
import {db} from "../../utilities/firebase";
import "./Feed.css";
import AppBar from '../AppBar/AppBar';

async function getPostsFromDB() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts = [];
  querySnapshot.forEach((doc) => {
      posts.push({id: doc.id, ...doc.data()});
  });
  return posts;
}

const fake_friends = ["Alice", "Bob", "Charlie", "David"];

function Feed({ friends }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
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

  useEffect(() => {
    if (search) {
      setFilteredPosts(posts.filter(post => post.course_name.toLowerCase().includes(search)));
    } else {
      setFilteredPosts(posts);
    }
  }, [search, posts]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 0) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => friends.some(friend => friend.displayName === post.username)));
    }
  };

  return (
    <div>
      <AppBar />
      <Tabs className="friends-public-switch" value={tabValue} onChange={handleChange} centered>
        <Tab label="Public" icon={<PublicIcon />} />
        <Tab label="Friends" icon={<PeopleIcon />} />
      </Tabs>
      <Container className="feed-content" maxWidth="sm">
        <div className="course-select-wrapper">
          <CourseSelect searchFunc={setSearch} />
        </div>
        <Box>
        <Stack spacing={3}>
          {filteredPosts.length === 0 ? (
            <p>No results found...</p>
          ) : (
            filteredPosts
              .slice()
              .sort((a, b) => b.date.seconds - a.date.seconds)
              .map((post) => (
                <div key={post.id}>
                  <Post post={post} isPublic={tabValue === 0} />
                </div>
              ))
          )}
        </Stack>
        </Box>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default Feed;
