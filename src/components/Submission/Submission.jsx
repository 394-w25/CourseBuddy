// React and components
import React from 'react';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

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
      await addDoc(collectionRef, post);
      console.log('Post added!');
    } catch (error) {
      console.error('Error adding post:', error);
    }
  }

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <TextField id="title" label="Title" value={title} type='text' onChange={(e) => setTitle(e.target.value)} />
      <TextField id="course" label="Course" value={course} type='text' onChange={(e) => setCourse(e.target.value)} />
      <TextField id="quarter" label="Quarter" value={quarter} type='text' onChange={(e) => setQuarter(e.target.value)} />
      <TextField id="body" label="Body" value={body} type='text' onChange={(e) => setBody(e.target.value)} />
      <TextField id="professor" label="Professor" value={professor} type='text' onChange={(e) => setProfessor(e.target.value)} />
      {/* <Rating id="rating" name="half-rating" defaultValue={0} precision={0.5} onChange={(e) => setRating(e.rating.value)} /> */}
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </Box>
  )

}






// function Submission () {
//   return (
//     <div>
//       <h1>Submission</h1>
//       <p>Feature not implemented yet...</p>
//       <p>Here is where you can submit a review.</p>
//     </div>
//   )
// }
  
export default Submission;