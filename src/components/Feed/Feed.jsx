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
import "./Feed.css";
import AppBar from '../AppBar/AppBar';

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

    const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  console.log(posts[0]);
  return (
    <div>
      <AppBar />
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Friends" icon={<PeopleIcon />} component={Link} to="/feed" />
        <Tab label="Public" icon={<PublicIcon />} component={Link} to="/public" />
      </Tabs>
      <CourseSelect searchFunc={setSearch} />
      <Container maxWidth="sm">
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

export default Feed;