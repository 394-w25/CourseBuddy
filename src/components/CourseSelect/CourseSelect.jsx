import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



function CourseSelect() {
    const [course, setCourse] = React.useState('All'); // change to 'All' later
    
    const handleChange = (event) => {
        setCourse(event.target.value);
        console.log(event.target.value);
    };
  
    return (
        <div>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Course Filter</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={course}
                label="Course Filter"
                onChange={handleChange}
                >
                <MenuItem value={"All"}>All</MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
  }
  
  export default CourseSelect;
  