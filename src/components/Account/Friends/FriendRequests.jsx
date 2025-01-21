import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Container } from '@mui/material';
import { 
  listenIncomingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest
} from '../../../services/friendService';
import AppBar from '../../AppBar/AppBar';
import NavigationBar from '../../NavigationBar/NavigationBar';
import "./FriendRequests.css";


function FriendRequests({ user }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Listen for incoming requests (status == 'pending')
    const unsubscribe = listenIncomingRequests(user.uid, setRequests);
    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (req) => {
    // req has { id, from, to, status, ... }
    await acceptFriendRequest(req.id, req.from, req.to);
  };

  const handleReject = async (req) => {
    await rejectFriendRequest(req.id);
  };

  const handleSendFakeReq = async () => {
    // test
    await sendFriendRequest(user.uid, "abc123");
  };

  return (
    <div>
      <AppBar />
      <Container className="friend-requests-content">
        <h2>Friend Requests</h2>

        <List>
          {requests.length === 0 && <p>No pending requests</p>}
          {requests.map((req) => (
            <ListItem key={req.id}>
              <ListItemText 
                primary={`From: ${req.from}`} 
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

        <hr />
        {/* test */}
        <Button onClick={handleSendFakeReq}>Send Test Request</Button>
      </Container>
      <NavigationBar />
    </div>
  );
}

export default FriendRequests;
