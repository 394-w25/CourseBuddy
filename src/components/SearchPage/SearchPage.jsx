import React, { useState, useEffect } from 'react';
import "./SearchPage.css";
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import { Container, Box, TextField, List, ListItem, ListItemText, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { db } from "../../utilities/firebase";
import { collection, getDocs, updateDoc, arrayUnion, getDoc, doc } from "firebase/firestore";
import Avatar from '@mui/material/Avatar';

async function getUsersFromDB() {
  // get all the users from the database
  const querySnapshot = await getDocs(collection(db, "users"));
  const users = [];
  querySnapshot.forEach((doc) => {
      users.push({id: doc.id, ...doc.data()});
  });
  return users;
}

function SearchPage({userUID}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  // user information about current user (me) 
  const [me, setMe] = useState(null);

  // useEffect runs every time the component is rendered
  useEffect(() => {
    async function fetchUsers() {
      try {
        const fetchedUsers = await getUsersFromDB();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    }
    fetchUsers();

    async function fetchMe() {
      try {
        const meRef = doc(db, "users", userUID);
        const res = await getDoc(meRef);

        setMe(res.data());
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    }
    fetchMe();
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = users.filter(user => user.displayName.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => {
        if (a.toLowerCase().startsWith(value.toLowerCase())) return -1;
        if (b.toLowerCase().startsWith(value.toLowerCase())) return 1;
        return 0;
      });

    setResults(filtered);
  };

  async function sendFriendRequest (friend) {
    try {
      const meRef = doc(db, "users", userUID);

      await updateDoc(meRef, {
        friendRequests: arrayUnion(friend.id)
      });

      console.log(`Successfully added ${friend.id} to friend requests.`);

      setMe((prevMe) => ({
        ...prevMe,
        friendRequests: [...prevMe.friendRequests, friend.id],
      }));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }

  return (
    <div>
      <AppBar />
      <Container className="search-content" maxWidth="sm">
        <Box my={4}>
          <TextField 
            fullWidth 
            label="Find your friends on CourseBuddy" 
            variant="outlined" 
            value={query} 
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <List>
            {results.filter(stranger => stranger.displayName !== me.displayName).map((stranger, index) => (
              <ListItem key={index} button>
                <Avatar className="profile-pic" src={stranger.photoURL} />
                <ListItemText primary={stranger.displayName} />
                {me.friends.includes(stranger.id) ? 
                    <Button variant="outlined">Following</Button> :
                    (me.friendRequests.includes(stranger.id) ?
                    <Button variant="outlined">Requested</Button> :
                    <Button variant="outlined" onClick={() => sendFriendRequest(stranger)}>Request</Button>)}
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
