import React, { useState } from 'react';
import {
  Stack, Button, Alert, Container, TextField, Rating, Typography,
  InputLabel, MenuItem, FormControl, Select, Box, Autocomplete
} from '@mui/material';
import NavigationBar from '../NavigationBar/NavigationBar';
import AppBar from '../AppBar/AppBar';
import "./Submission.css";
import { useNavigate } from "react-router-dom";

import { db } from '../../utilities/firebase';
import { collection, addDoc } from "firebase/firestore";

import { SUBJECTS } from '../../utilities/subjectData';

function Submission({ userName }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(null);
  const [classNumber, setClassNumber] = useState("");
  const [quarter, setQuarter] = useState("");
  const [year, setYear] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(0);
  const [professor, setProfessor] = useState("");
  const [fillInFields, setFillInFields] = useState(false);
  const [selectedButton, setSelectedButton] = useState("");

  const handleButtonClick = (buttonType) => {
    setSelectedButton(buttonType);
  };

  async function handleSubmit() {
    // all required fields must be present
    if (
      !title ||
      !subject ||         // must have chosen from the dropdown
      !classNumber ||
      !professor ||
      !rating ||
      !selectedButton
    ) {
      setFillInFields(true);
      return;
    }
  
    try {
      const collectionRef = collection(db, 'posts');
      
      // subject + classNumber into a single "course_name"
      const courseName = subject + " " + classNumber; 
  
  
      const post = {
        title: title,
        course_name: courseName,
        quarter: quarter + " " + year,
        body: body,
        rating: rating,
        professor: professor,
        username: userName.displayName,
        date: new Date(),
        anonymous: (selectedButton === 'anonymous'),
  

       authorUid: userName.uid,
       authorPhotoURL: userName.photoURL,
      };
  
      await addDoc(collectionRef, post);
      navigate('/feed');
      console.log('Post added!');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  }
  

  return (
    <div>
      <AppBar />
      <Container maxWidth="xs" className="submission-content">
        <Stack spacing={2}>
          {/* "Subject" + "Class Number" side by side */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Autocomplete
              disablePortal
              options={SUBJECTS}
              value={subject}
              onChange={(event, newValue) => setSubject(newValue)}
              sx={{ width: '60%' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subject"
                  size="small"
                  required
                />
              )}
            />

            <TextField
              size="small"
              required
              label="Course Num"
              sx={{ width: '40%' }}
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
            />
          </Box>

          <TextField
            size="small"
            required
            id="professor"
            label="Professor"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
          />

          {/* Quarter selection */}
          <FormControl size="small" fullWidth>
            <InputLabel id="quarter-label">Quarter</InputLabel>
            <Select
              labelId="quarter-label"
              id="quarter-select"
              value={quarter}
              label="Quarter"
              onChange={(e) => setQuarter(e.target.value)}
            >
              <MenuItem value="Spring">Spring</MenuItem>
              <MenuItem value="Summer">Summer</MenuItem>
              <MenuItem value="Fall">Fall</MenuItem>
              <MenuItem value="Winter">Winter</MenuItem>
            </Select>
          </FormControl>

          {/* Year selection */}
          <FormControl size="small" fullWidth>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              id="year-select"
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2021">2021</MenuItem>
              <MenuItem value="2020">2020</MenuItem>
              <MenuItem value="2019">2019</MenuItem>
            </Select>
          </FormControl>

          {/* Title text */}
          <TextField 
            size="small" 
            required 
            id="title" 
            label="Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />

          {/* Body text */}
          <TextField
            required
            id="body"
            multiline
            rows={2}
            label="Write your review!"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          {/* Rating */}
          <div className="rating-box">
            <Typography variant="subtitle1" component="legend">
              Course Rating
            </Typography>
            <Rating
              size="large"
              id="rating"
              name="half-rating"
              defaultValue={0}
              precision={0.5}
              onChange={(_, newValue) => setRating(newValue)}
            />
          </div>

          {/* Anonymous toggle buttons */}
          <div className="anonymous-buttons">
            <Button
              size="small"
              variant={selectedButton === 'showName' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('showName')}
            >
              Show Name
            </Button>
            <Button
              size="small"
              variant={selectedButton === 'anonymous' ? 'contained' : 'outlined'}
              onClick={() => handleButtonClick('anonymous')}
            >
              Anonymous
            </Button>
          </div>

          {/* Warning if incomplete */}
          {fillInFields && (
            <Alert variant="filled" severity="warning">
              Fill in all the fields before submitting.
            </Alert>
          )}

          {/* Submit */}
          <Button size="small" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Stack>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default Submission;
