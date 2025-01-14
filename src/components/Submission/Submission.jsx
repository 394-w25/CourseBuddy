// React and components
import React from 'react';
import { Stack, Button, Alert, Container, TextField, Rating, Typography } from '@mui/material';
import NavigationBar from '../NavigationBar/NavigationBar';
import "./Submission.css";

// Firebase
// Source: How to add/set documents. https://firebase.google.com/docs/firestore/manage-data/add-data

import { db } from '../../utilities/firebase';
import { collection, addDoc } from "firebase/firestore";
// Source: Also how to use FB with React. https://www.freecodecamp.org/news/how-to-use-the-firebase-database-in-react/

function Submission() {
  const [title, setTitle] = React.useState("");
  const [course, setCourse] = React.useState("");
  const [quarter, setQuarter] = React.useState("");
  const [body, setBody] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [professor, setProfessor] = React.useState("");
  const [fillInFields, setFillInFields] = React.useState(false);

  async function handleSubmit() {
    try {
      const collectionRef = collection(db, 'posts');
      const post = {
        title: title,
        course_name: course,
        quarter: quarter,
        body: body,
        rating: rating,
        professor: professor,
        date: new Date()
      }

      if (!title || !course || !body || !professor || !rating) {
        setFillInFields(true);
      } else {
        await addDoc(collectionRef, post);
        console.log('Post added!');
      }

    } catch (error) {
      console.error('Error adding post:', error);
    }
  }

  return (

    <div>
      <Container className="submission-page">
        <Stack spacing={3}>
          <TextField required id="title" label="Title" value={title} type='text' onChange={(e) => setTitle(e.target.value)} />
          <TextField required id="course" label="Course" value={course} type='text' onChange={(e) => setCourse(e.target.value)} />
          <TextField required id="professor" label="Professor" value={professor} type='text' onChange={(e) => setProfessor(e.target.value)} />
          <TextField required id="quarter" label="Quarter" value={quarter} type='text' onChange={(e) => setQuarter(e.target.value)} />
          <TextField required id="body" multiline rows={5} label="Write your review!" value={body} type='text' onChange={(e) => setBody(e.target.value)} />
          <div className="rating-box">
            <Typography variant="h6" component="legend">Course Rating</Typography>
            <Rating id="rating" name="half-rating" size="large" defaultValue={0} precision={0.5} onChange={(_, newValue) => setRating(newValue)} />
          </div>
          {(fillInFields) ? <Alert variant="filled" severity="warning">Fill in all the fields before submitting.</Alert> : null}
          <Button variant="contained" onClick={handleSubmit} >Submit</Button>
        </Stack>
      </Container>
      <NavigationBar />
    </div>
  )
}

export default Submission;