import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import NavigationBar from '../NavigationBar/NavigationBar';
import CourseSelect from '../CourseSelect/CourseSelect';
import RestoreIcon from '@mui/icons-material/Restore';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link } from "react-router-dom";
import { Container, Box, Stack } from '@mui/material';
import { collection, getDocs } from "firebase/firestore"; 
import {db} from "../../utilities/firebase";
import "./PublicFeed.css";
import AppBar from '../AppBar/AppBar';

async function getPostsFromDB() {
  // get all the posts from the database

  // might have to make a "public" database for public posts
  const querySnapshot = await getDocs(collection(db, "publicPosts"));
  const posts = [];
  querySnapshot.forEach((doc) => {
      posts.push({id: doc.id, ...doc.data()});
  });
  return posts;
}

const fake_friends = ["Alice", "Bob", "Charlie", "David"];

function PublicFeed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState();
  const [filteredposts, setFilteredposts] = useState([]);

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

  // Source: https://www.freecodecamp.org/news/filter-arrays-in-javascript/
  // How to filter an array by search term ^
  // https://www.geeksforgeeks.org/how-to-build-a-search-filter-using-react-hooks/
  useEffect(() => {
    if (search) { // if there's something in the search bar
      setFilteredposts(posts.filter(post => post.course_name.toLowerCase().includes(search)))
    }
    else {
      setFilteredposts(posts) // retrieve all if the search bar isn't being used
    }
  }, [search, posts]); // must define the states that cause re-rendering

  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log(posts[0]);
  return (
    <div>
      <AppBar />
      <Tabs className="friends-public-switch" value={value} onChange={handleChange} centered>
        <Tab label="Friends" icon={<PeopleIcon />} component={Link} to="/feed" />
        <Tab label="Public" icon={<PublicIcon />} component={Link} to="/public" />
      </Tabs>
      <Container className="feed-content" maxWidth="sm">
      <CourseSelect searchFunc={setSearch} />
        <Box paddingBottom="30px">
          <Stack spacing={3}>
              { filteredposts.length === 0 ?
                (<p>No results found...</p>) :
                  (filteredposts
                    .slice()
                    .sort((a, b) => b.date.seconds - a.date.seconds).map((post) => 
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

export default PublicFeed;