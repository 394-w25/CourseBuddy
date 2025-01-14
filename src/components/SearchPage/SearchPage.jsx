import React, { useState } from 'react';
import "./SearchPage.css";
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import { Container, Box, TextField, List, ListItem, ListItemText, Button } from '@mui/material';

const friendsDb = ["Anna", "Andrew", "Angela", "Anthony", "Ben", "Bella", "Chris", "Catherine", "Diana"];

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = friendsDb.filter(name => name.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => {
        if (a.toLowerCase().startsWith(value.toLowerCase())) return -1;
        if (b.toLowerCase().startsWith(value.toLowerCase())) return 1;
        return 0;
      });

    setResults(filtered);
  };

  return (
    <div>
      <AppBar />
      <Container className="search-page" maxWidth="sm">
        <Box my={4}>
          <TextField 
            fullWidth 
            label="Search friends" 
            variant="outlined" 
            value={query} 
            onChange={handleSearch}
          />
          <List>
            {results.map((name, index) => (
              <ListItem key={index} button>
                <ListItemText primary={name} />
                <Button variant="outlined">Request</Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default SearchPage;
