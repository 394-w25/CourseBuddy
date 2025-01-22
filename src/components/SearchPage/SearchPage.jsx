import React, { useState, useEffect } from 'react';
import "./SearchPage.css";
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import { Container, TextField, List, InputAdornment, Button } from '@mui/material';
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
  fetchUserFriends,
  removeFriend
} from '../../utilities/friendService';
import UserItem from './UserItem/UserItem';

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
    const updated = results.map(r => {
      const isFriend = me.friends.includes(r.id);
      return { ...r, isFriend };
    });
    setResults(updated);
  }, [me]);

  const subscribeMe = () => {
    onSnapshot(doc(db, "users", userUID), snap => {
      if (snap.exists()) {
        setMe({ id: userUID, ...snap.data() });
      }
    });
  };

  const subscribeRequests = () => {
    listenIncomingRequests(userUID, async raw => {
      const arr = [];
      for (const req of raw) {
        const ref = doc(db, 'users', req.from);
        const snap = await getDoc(ref);
        let fromDisplay = req.from;
        let fromPhoto = '';
        if (snap.exists()) {
          const data = snap.data();
          fromDisplay = data.displayName || data.email || req.from;
          fromPhoto = data.photoURL || '';
        }
        arr.push({ ...req, fromDisplay, fromPhoto });
      }
      setRequests(arr);
    });
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

  const getButtonLabel = usr => {
    if (usr.isFriend) return "Unfriend";
    if (usr.isRequested) return "Cancel Request";
    return "Add Friend";
  };
  

  const handleButtonClick = async (usr, index) => {
    if (!me) return;
  
    if (usr.isFriend) {
      await removeFriend(userUID, usr.id);
      await removeFriend(usr.id, userUID);
    
      const updated = [...results];
      updated[index] = { ...updated[index], isFriend: false, isRequested: false };
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
    <div className="search-page">
      <AppBar />
      <Container className="search-content">
        <div className="search-box">
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
        </div>
        <List>
          {results.map((usr, index) => (
            <UserItem
              key={usr.id}
              avatarURL={usr.photoURL}
              primaryText={usr.displayName}
              secondaryText={usr.email || ''}
              mainButtonLabel={getButtonLabel(usr)}
              onMainButtonClick={() => handleButtonClick(usr, index)}
              showMainButton
              divider
            />
          ))}
        </List>
        <hr className="divider" />
        <h2 className="section-title">Incoming Requests</h2>
        <List>
          {requests.length === 0 && <p>No pending requests</p>}
          {requests.map(req => (
            <UserItem
              key={req.id}
              avatarURL={req.fromPhoto}
              primaryText={req.fromDisplay}
              mainButtonLabel="Accept"
              onMainButtonClick={() => handleAccept(req)}
              showMainButton
              divider={false}
            >
              <Button color="secondary" variant="outlined" onClick={() => handleReject(req)}>
                Reject
              </Button>
            </UserItem>
          ))}
        </List>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default SearchPage;
