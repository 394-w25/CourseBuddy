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

/**
 * Safely default friends, likedPosts, and setLikedPosts 
 * so that we never get “Cannot read property of undefined.”
 */
function Feed({
  user,
  friends = [],                // default to empty array if not provided
  likedPosts = [],            // default to empty array
  setLikedPosts = () => {}    // default to a no-op function
}) {
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

  // 2) Filter posts by search or “friends” each time dependencies change
  useEffect(() => {
    let newFiltered = posts;

    // Filter by search query in course_name
    if (search) {
      newFiltered = newFiltered.filter(post =>
        post.course_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // If tabValue === 1, show only “friends’” posts
    if (tabValue === 1) {
      newFiltered = newFiltered.filter(post =>
        friends.some(friend => friend.displayName === post.username)
      );
    }

    setFilteredPosts(newFiltered);
  }, [search, posts, tabValue, friends]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <AppBar />
      <h1> This is to test whether auto deploy works... </h1>
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
