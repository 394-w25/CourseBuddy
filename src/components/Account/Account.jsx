import { Box, Container, Typography, Button, Switch, Divider, Card, CardContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NavigationBar from '../NavigationBar/NavigationBar';
import AppBar from '../AppBar/AppBar';
import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import "./Account.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utilities/firebase";

function Account({ userName, userEmail, profilePic, friends, filteredPost, setFilteredPost }) {
  const navigate = useNavigate();

  const signOut = () => {
    navigate("/");
  };

  const handleFriendsClick = () => {
    navigate('/my-friends');
  };

  async function getPostsFromDB() {
    try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const posts = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().username === userName?.displayName){
                posts.push({ id: doc.id, ...doc.data() });
            }
        });
        return posts;
    } catch (error) {
        console.log("Error: ", error);
    }

}

useEffect(() => {
    async function fetchPosts() {
        try {
            const fetchedPosts = await getPostsFromDB();
            setFilteredPost(fetchedPosts);
        } catch (error) {
            console.error("Error fetching posts: ", error);
        }
    }
    fetchPosts();
}, [userName]);

  return (
    <div>
      <AppBar />
      <Container 
        maxWidth="sm"
        className="account-content"
      >
        <Box
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#e0e0e0',
            display: 'inline-block',
            marginBottom: '20px',
          }}
        >
          <Avatar sx={{ width: 80, height: 80 }} src={profilePic} />
        </Box>

        <Box className="account-details">
          <Typography
            variant="body1"
            style={{
              fontWeight: 'bold',
              backgroundColor: '#2196f3',
              color: 'white',
              padding: '10px',
              borderRadius: '5px'
            }}
          >
            {"Name: "}{userName?.displayName || "Unknown User"}
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              marginTop: '10px'
            }}
          >
            {"Email: "}{userEmail || "No email available"}
          </Typography>
        </Box>

        <Box style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
          <Card style={{ width: '45%', backgroundColor:'#BCBCBC' }}>
            <CardContent>
              <Typography variant="subtitle1">Classes Rated:</Typography>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>{filteredPost.length}</Typography>
            </CardContent>
          </Card>
          
          <Card
            style={{ width: '45%', backgroundColor:'#BCBCBC', cursor: 'pointer' }}
            onClick={handleFriendsClick}
          >
            <CardContent>
              <Typography variant="subtitle1">Friends:</Typography>
              <Typography variant="h5" style={{ fontWeight: 'bold' }}>{friends.length}</Typography>
            </CardContent>
          </Card>
        </Box>

        <Divider style={{ margin: '20px 0' }} />
        <Box>
          <Button
            variant="outlined"
            endIcon={<EditIcon />}
            onClick={() => navigate('/rating-history')}
            style={{ marginBottom: '10px', width: '100%' }}
          >
            View Rating History
          </Button>
        </Box>
        <Divider style={{ margin: '20px 0' }} />

        <Box style={{ textAlign: 'left' }}>
          <Button
            variant="contained"
            color="error"
            style={{ marginTop: '20px', width: '100%', marginBottom: '20px' }}
            onClick={signOut}
          >
            Sign Out
          </Button>
        </Box>
      </Container>

      <NavigationBar />
    </div>
  );
}

export default Account;
