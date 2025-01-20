import React from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import "./CourseSelect.css";

// tips for building a search bar: https://dev.to/salehmubashar/search-bar-in-react-js-545l

// Source: https://samhalll.medium.com/implementing-a-search-bar-feature-in-react-10739d594f79
// this explains how to pass props to a search bar comp

function CourseSelect( {searchFunc} ) {

    function onType(e) {
        // console.log(e.target.value.toLowerCase());
        searchFunc(e.target.value.toLowerCase());
    }
  
    return (
        <Paper
        className="search-bar"
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search by Course Name"
                inputProps={{ 'aria-label': 'search by course' }}
                onChange={onType}
            />
            <IconButton sx={{ p: '10px', pointerEvents: 'none' }} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
  }
  
  export default CourseSelect;
  