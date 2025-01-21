import React, { useEffect, useState } from 'react';
import { Container, List, ListItem, ListItemText, Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../utilities/firebase';
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
} from '../../../services/friendService';
import AppBar from '../../AppBar/AppBar';
import NavigationBar from '../../NavigationBar/NavigationBar';
import "./Friends.css";

function FriendRequests({ user }) {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = listenIncomingRequests(user.uid, async (raw) => {
      const augmented = await Promise.all(
        raw.map(async (req) => {
          const ref = doc(db, 'users', req.from);
          const snap = await getDoc(ref);
          let fromDisplay = req.from;
          if (snap.exists()) {
            const data = snap.data();
            fromDisplay = data.displayName || data.email || req.from;
          }
          return { ...req, fromDisplay };
        })
      );
      setRequests(augmented);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (req) => {
    await acceptFriendRequest(req.id, req.from, req.to);
  };

  const handleReject = async (req) => {
    await rejectFriendRequest(req.id);
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const found = await searchUsersInFirestore(value);

      const filtered = found.filter((f) => f.id !== user.uid);

      const myFriends = await fetchUserFriends(user.uid);

      const resultsAugmented = [];
      for (const usr of filtered) {
        const pendingDoc = await findPendingRequestDoc(user.uid, usr.id);
        const isRequested = !!pendingDoc;
        const isFriend = myFriends.includes(usr.id);
        resultsAugmented.push({
          ...usr,
          requestDoc: pendingDoc ? pendingDoc.docId : null,
          isRequested,
          isFriend
        });
      }
      setSearchResults(resultsAugmented);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleActionClick = async (usr, index) => {
    if (usr.isFriend) {
      await removeFriend(user.uid, usr.id);
      const newResults = [...searchResults];
      newResults[index] = { ...newResults[index], isFriend: false };
      setSearchResults(newResults);
      return;
    }
    if (!usr.isRequested) {
      const docId = await sendFriendRequest(user.uid, usr.id);
      const updated = [...searchResults];
      updated[index] = { ...updated[index], isRequested: true, requestDoc: docId || null };
      setSearchResults(updated);
    } else {
      if (usr.requestDoc) {
        await cancelFriendRequestIfPending(usr.requestDoc);
        const updated = [...searchResults];
        updated[index] = { ...updated[index], isRequested: false, requestDoc: null };
        setSearchResults(updated);
      }
    }
  };

  const getButtonLabel = (usr) => {
    if (usr.isFriend) return 'Unfriend';
    if (usr.isRequested) return 'Requested';
    return 'Add Friend';
  };

  return (
    <div>
      <AppBar />
      <Container className="friend-requests-page">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by displayName or email"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          style={{ marginBottom: '20px' }}
        />

        {searchResults.length > 0 && (
          <>
            <h3>Search Results</h3>
            <List>
              {searchResults.map((usr, i) => (
                <ListItem key={usr.id}>
                  <ListItemText
                    primary={usr.displayName || 'No Name'}
                    secondary={usr.email || 'No Email'}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleActionClick(usr, i)}
                  >
                    {getButtonLabel(usr)}
                  </Button>
                </ListItem>
              ))}
            </List>
            <hr />
          </>
        )}

        <h2>Friend Requests</h2>
        <List>
          {requests.length === 0 && <p>No pending requests</p>}
          {requests.map((req) => (
            <ListItem key={req.id}>
              <ListItemText
                primary={`From: ${req.fromDisplay}`}
                secondary={`Status: ${req.status}`}
              />
              <Button variant="contained" color="primary" onClick={() => handleAccept(req)}>
                Accept
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => handleReject(req)}>
                Reject
              </Button>
            </ListItem>
          ))}
        </List>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default FriendRequests;
