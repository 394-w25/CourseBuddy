import React, { useState } from 'react';
import { Stack, Button, Alert, Container, TextField, Rating, Typography, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import NavigationBar from '../NavigationBar/NavigationBar';
import AppBar from '../AppBar/AppBar';
import "./Submission.css";
import { useNavigate } from "react-router-dom";

// Firebase
// Source: How to add/set documents. https://firebase.google.com/docs/firestore/manage-data/add-data

import { db } from '../../utilities/firebase';
import { collection, addDoc } from "firebase/firestore";
// Source: Also how to use FB with React. https://www.freecodecamp.org/news/how-to-use-the-firebase-database-in-react/

function Submission({ userName }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [quarter, setQuarter] = useState("");
  const [year, setYear] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [professor, setProfessor] = useState("");
  const [fillInFields, setFillInFields] = useState(false);
  const [selectedButton, setSelectedButton] = useState("");


  async function handleSubmit() {
    try {
      const collectionRef = collection(db, 'posts');
      const post = {
        title: title,
        course_name: course,
        quarter: quarter + " " + year,
        body: body,
        rating: rating,
        professor: professor,
        username: userName.displayName,
        date: new Date(),
        anonymous: selectedButton === 'anonymous' ? true : false
      };

      if (!title || !course || !body || !professor || !rating || !selectedButton ) {
        setFillInFields(true);
      } else {
        await addDoc(collectionRef, post);
        navigate('/feed');
        console.log('Post added!');
      }

    } catch (error) {
      console.error('Error adding post:', error);
    }
  }

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
    // Save the data or handle side effects here
    console.log(`Selected: ${buttonType}`);
  };

  return (

    <div>
      <AppBar />
      <Container className="submission-content">
        <Stack spacing={2}>
          <TextField required id="title" label="Title" value={title} type='text' onChange={(e) => setTitle(e.target.value)} />
          <TextField required id="course" label="Course" value={course} type='text' onChange={(e) => setCourse(e.target.value)} />
          <TextField required id="professor" label="Professor" value={professor} type='text' onChange={(e) => setProfessor(e.target.value)} />
          
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Quarter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={quarter}
              label="Quarter"
              onChange={(e)=>setQuarter(e.target.value)}
            >
              <MenuItem value={"Spring"}>Spring</MenuItem>
              <MenuItem value={"Summer"}>Summer</MenuItem>
              <MenuItem value={"Fall"}>Fall</MenuItem>
              <MenuItem value={"Winter"}>Winter</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Year</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={year}
              label="Year"
              onChange={(e)=>setYear(e.target.value)}
            >
              <MenuItem value={"2025"}>2025</MenuItem>
              <MenuItem value={"2024"}>2024</MenuItem>
              <MenuItem value={"2023"}>2023</MenuItem>
              <MenuItem value={"2022"}>2022</MenuItem>
              <MenuItem value={"2021"}>2021</MenuItem>
              <MenuItem value={"2020"}>2020</MenuItem>
              <MenuItem value={"2019"}>2019</MenuItem>
            </Select>
          </FormControl>

          {/* <TextField required id="quarter" label="Quarter" value={quarter} type='text' onChange={(e) => setQuarter(e.target.value)} /> */}
          <TextField required id="body" multiline rows={3} label="Write your review!" value={body} type='text' onChange={(e) => setBody(e.target.value)} />
          <div className="rating-box">
            <Typography variant="h6" component="legend">Course Rating</Typography>
            <Rating id="rating" name="half-rating" size="large" defaultValue={0} precision={0.5} onChange={(_, newValue) => setRating(newValue)} />
          </div>
          <div className="anonymous-buttons">
            <Button
              variant={selectedButton === 'showName' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('showName')}
            >
              Show Name
            </Button>
            <Button
              variant={selectedButton === 'anonymous' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('anonymous')}
            >
              Anonymous
            </Button>
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