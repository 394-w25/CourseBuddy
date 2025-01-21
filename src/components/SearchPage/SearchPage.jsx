import React, { useState, useEffect } from 'react';
import "./SearchPage.css";
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import { Container, Box, TextField, List, ListItem, ListItemText, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from "../../utilities/firebase";
import {
  listenIncomingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  searchUsersInFirestore,
  sendFriendRequest,
  cancelFriendRequestIfPending,
  findPendingRequestDoc,
  removeFriend
} from '../../services/friendService';
import Avatar from '@mui/material/Avatar';

function SearchPage({ userUID }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [me, setMe] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!userUID) return;
    subscribeMe();
    subscribeRequests();
  }, [userUID]);

  useEffect(() => {
    if (!me || results.length === 0) return;
    const updated = results.map((r) => {
      const isFriend = me.friends.includes(r.id);
      return { ...r, isFriend };
    });
    setResults(updated);
  }, [me]);

  const subscribeMe = () => {
    const unsub = onSnapshot(doc(db, "users", userUID), (snap) => {
      if (snap.exists()) {
        setMe({ id: userUID, ...snap.data() });
      }
    });
    return unsub;
  };

  const subscribeRequests = () => {
    const unsub = listenIncomingRequests(userUID, async (raw) => {
      const augmented = [];
      for (const req of raw) {
        const fromRef = doc(db, 'users', req.from);
        const snap = await getDoc(fromRef);
        let fromDisplay = req.from;
        if (snap.exists()) {
          const data = snap.data();
          fromDisplay = data.displayName || data.email || req.from;
        }
        augmented.push({ ...req, fromDisplay });
      }
      setRequests(augmented);
    });
    return () => unsub();
  };

  const handleAccept = async (req) => {
    await acceptFriendRequest(req.id, req.from, req.to);
  };

  const handleReject = async (req) => {
    await rejectFriendRequest(req.id);
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      return;
    }
    const found = await searchUsersInFirestore(val);
    const filtered = found.filter(u => u.id !== userUID);
    const myFriends = me?.friends || [];
    const final = [];
    for (const stranger of filtered) {
      const pendingDoc = await findPendingRequestDoc(userUID, stranger.id);
      const isRequested = !!pendingDoc;
      const isFriend = myFriends.includes(stranger.id);
      final.push({
        ...stranger,
        requestDoc: pendingDoc ? pendingDoc.docId : null,
        isRequested,
        isFriend
      });
    }
    setResults(final);
  };

  const getButtonLabel = (usr) => {
    if (usr.isFriend) return "Unfriend";
    if (usr.isRequested) return "Requested";
    return "Add Friend";
  };

  const handleButtonClick = async (usr, index) => {
    if (!me) return;
    if (usr.isFriend) {
      await removeFriend(userUID, usr.id);
      await removeFriend(usr.id, userUID);
      const updated = [...results];
      updated[index] = { ...updated[index], isFriend: false };
      setResults(updated);
      return;
    }
    if (!usr.isRequested) {
      const docId = await sendFriendRequest(userUID, usr.id);
      const updated = [...results];
      updated[index] = { ...updated[index], isRequested: true, requestDoc: docId || null };
      setResults(updated);
    } else {
      if (usr.requestDoc) {
        await cancelFriendRequestIfPending(usr.requestDoc);
        const updated = [...results];
        updated[index] = { ...updated[index], isRequested: false, requestDoc: null };
        setResults(updated);
      }
    }
  };

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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List>
            {results.map((stranger, index) => (
              <ListItem key={stranger.id} button>
                <Avatar className="profile-pic" src={stranger.photoURL} />
                <ListItemText primary={stranger.displayName} />
                <Button
                  variant="outlined"
                  onClick={() => handleButtonClick(stranger, index)}
                >
                  {getButtonLabel(stranger)}
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
        <hr />
        <h2>Incoming Requests</h2>
        <List>
          {requests.length === 0 && <p>No pending requests</p>}
          {requests.map((req) => (
            <ListItem key={req.id}>
              <ListItemText
                primary={`From: ${req.fromDisplay}`}
                secondary={`Status: ${req.status}`}
              />
              <Button variant="contained" onClick={() => handleAccept(req)}>Accept</Button>
              <Button variant="outlined" onClick={() => handleReject(req)}>Reject</Button>
            </ListItem>
          ))}
        </List>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default SearchPage;
