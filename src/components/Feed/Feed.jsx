import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import { Container } from '@mui/material';
import "./Feed.css";
// import { db } from '../../firebase';

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
}

const fake_friends = ["Alice", "Bob", "Charlie", "David"];

function Feed() {
    
  return (
    <div>
        <Container className="feed-screen" maxWidth="sm">
        <Post post={fake_post} friends={fake_friends}/>
        <br />
        <Post post={fake_post} friends={fake_friends}/>
        <br />
        <Post post={fake_post} friends={fake_friends}/>
        </Container>
    </div>
  )
};

export default Feed;