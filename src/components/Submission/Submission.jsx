// React and components
import React from 'react';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// Firebase
// Source: How to add/set documents. https://firebase.google.com/docs/firestore/manage-data/add-data

import { db } from '../../utilities/firebase';
import { collection, addDoc } from "firebase/firestore";
// Source: Also how to use FB with React. https://www.freecodecamp.org/news/how-to-use-the-firebase-database-in-react/

function Submission() {

    // May have to use useRef to pull values from the textfields: https://react.dev/reference/react/useRef
    const titleRef = React.useRef();
    const courseRef = React.useRef();
    const quarterRef = React.useRef();
    const bodyRef = React.useRef();
    const ratingRef = React.useRef();
    const professorRef = React.useRef();
    // now we can attach these references to the text boxes.


    // Source: React Handler. https://react.dev/learn/responding-to-events
    async function handleSubmit() {
        try {
            // Source: how to access current value of ref. https://react.dev/learn/referencing-values-with-refs
            // This function is called to retrieve the review fields when we click the 'Post' button
            const title_value = titleRef.current;
            const course_value = courseRef.current;
            const quarter_value = quarterRef.current;
            const body_value = bodyRef.current;
            const rating_value = ratingRef.current;
            const professor_value = professorRef.current;

            // now we need to push to Firebase
            const docRef = await addDoc(collection(db, "reviews"), {
                title: title_value,
                course: course_value,
                quarter: quarter_value,
                body: body_value,
                rating: rating_value,
                professor: professor_value,
                date: new Date() // retrieves the current date. Will have to reformat for readability when pulling this data
                
                // name: "Tokyo",
                // country: "Japan"
            });
        } catch (e) {
            console.error("error:", e);
        }
    }
    return (
        // Here's how to add the references to the textfields: https://stackoverflow.com/questions/59647940/how-can-i-use-ref-in-textfield
      <div>
        <TextField inputRef={titleRef} id="outlined-basic" label="Title" variant="outlined" />
        <TextField inputRef={courseRef} id="outlined-basic" label="Course Name" variant="outlined" />
        <TextField inputRef={quarterRef} id="outlined-basic" label="Quarter" variant="outlined" />
        <TextField inputRef={professorRef} id="outlined-basic" label="Professor" variant="outlined" />
        <TextField 
          inputRef={bodyRef}
          id="outlined-multiline-flexible"
          label="Comment"
          multiline
          minRows={2}
          maxRows={6}
        />
        <Rating inputRef={ratingRef} name="half-rating" defaultValue={0} precision={0.5} />
        <Button onClick={handleSubmit} variant="text">Post</Button>
      </div>
    )
  };

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