import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import NavigationBar from '../NavigationBar/NavigationBar';
import CourseSelect from '../CourseSelect/CourseSelect';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import { Container, Box, Stack, Typography, Tabs, Tab } from '@mui/material';
import { collection, getDocs, query, orderBy } from "firebase/firestore"; 
import { db } from "../../utilities/firebase";
import "./Feed.css";
import AppBar from '../AppBar/AppBar';

// Fetch posts from Firestore in descending order by date:
async function getPostsFromDB() {
  const q = query(collection(db, "posts"), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);

  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });
  return posts;
}

function Feed({ user, friends, likedPosts, setLikedPosts }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  // 1) Initial fetch of posts, sorted by date
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

  // 2) Filter posts by search or “friends” every time posts/search/tabValue/friends change
  useEffect(() => {
    let filtered = posts;

    if (search) {
      filtered = filtered.filter(post =>
        post.course_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (tabValue === 1) {
      // “Friends” tab only shows posts by people in the `friends` array
      filtered = filtered.filter(post =>
        friends.some(friend => friend.displayName === post.username)
      );
    }

    setFilteredPosts(filtered);
  }, [search, posts, tabValue, friends]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <AppBar />
      <Tabs
        className="friends-public-switch"
        value={tabValue}
        onChange={handleChange}
        centered
      >
        <Tab label="Public" icon={<PublicIcon />} />
        <Tab label="Friends" icon={<PeopleIcon />} />
      </Tabs>

      <Container className="feed-content" maxWidth="sm">
        <div className="course-select-wrapper">
          {/* The search box you have (CourseSelect) */}
          <CourseSelect searchFunc={setSearch} />
        </div>

        <Box>
          <Stack spacing={3}>
            {filteredPosts.length === 0 ? (
              <Typography className="no-friends-text" variant="h4">
                Your friends have not reviewed any courses yet. 
                Add more friends to see some posts!
              </Typography>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id}>
                  <Post
                    post={post}
                    user={user}
                    likedPosts={likedPosts}
                    setLikedPosts={setLikedPosts}
                    isPublic={tabValue === 0}
                  />
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
