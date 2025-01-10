// React and components
import React from 'react';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Firebase
// Source: How to add/set documents. https://firebase.google.com/docs/firestore/manage-data/add-data

// import { db } from '/firebase';
import { collection, addDoc } from "firebase/firestore";
// Source: Also how to use FB with React. https://www.freecodecamp.org/news/how-to-use-the-firebase-database-in-react/

function Submission() {

    // May have to use useRef to pull values from the textfields: https://react.dev/reference/react/useRef
    const titleRef = useRef();
    const courseRef = useRef();
    const quarterRef = useRef();
    const professorRef = useRef();
    // now we can attach these references to the text boxes.


    // Source: React Handler. https://react.dev/learn/responding-to-events
    function handleSubmit() {
        // Source: how to access current value of ref. https://react.dev/learn/referencing-values-with-refs
        // This function is called to retrieve the review fields when we click the 'Post' button
        
    }
    return (
        // Here's how to add the references to the textfields: https://stackoverflow.com/questions/59647940/how-can-i-use-ref-in-textfield
      <div>
        <TextField inputRef={titleRef} id="outlined-basic" label="Title" variant="outlined" />
        <TextField inputRef={courseRef} id="outlined-basic" label="Course Name" variant="outlined" />
        <TextField inputRef={quarterRef} id="outlined-basic" label="Quarter" variant="outlined" />
        <TextField inputRef={professorRef} id="outlined-basic" label="Professor" variant="outlined" />
        <TextField 
          id="outlined-multiline-flexible"
          label="Comment"
          multiline
          maxRows={6}
        />
        <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
        <Button onClick={handleSubmit} variant="text">Post</Button>
      </div>
    )
  };

  // will need to make this a function that is called when we click the 'Post' button
  const docRef = await addDoc(collection(db, "reviews"), {
    // title: 
    
    // name: "Tokyo",
    // country: "Japan"
  });
  
  export default Submission;