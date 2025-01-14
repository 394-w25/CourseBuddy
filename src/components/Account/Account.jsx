import { Box, Container, Typography, Button, Switch, Divider, Card, CardContent, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NavigationBar from '../NavigationBar/NavigationBar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '../AppBar/AppBar';
import React, { useState, useEffect } from 'react';
import Post from '../Post/Post';
import { collection, getDocs } from "firebase/firestore"; 
import {db} from "../../utilities/firebase";
import { useNavigate } from 'react-router-dom';



function Account({ userName, userEmail }) {
    const navigate = useNavigate();

    // const [filteredPost, setFilteredPost] = useState([]);

    // async function getPostsFromDB() {
    //     try {
    //         const querySnapshot = await getDocs(collection(db, "posts"));
    //         const posts = [];
    //         querySnapshot.forEach((doc) => {
    //             // console.log("doc status before pushing: ", doc.data());
    //             // console.log("username: ", doc.data().username);
    //             // console.log("displayName: ", userName.displayName);
    //             if (doc.data().username === userName?.displayName){
    //                 posts.push({ id: doc.id, ...doc.data() });
    //             }
    //         });
    //         //const filteredPosts = posts.filter(post => post.username === userName?.displayName);
    //         return posts;
    //     } catch (error) {
    //         console.log("Error: ", error);
    //     }
    
    // }

    // useEffect(() => {
    //     async function fetchPosts() {
    //         try {
    //             const fetchedPosts = await getPostsFromDB();
    //             setFilteredPost(fetchedPosts);
    //             console.log("Filtered posts: ", fetchedPosts);
    //         } catch (error) {
    //             console.error("Error fetching posts: ", error);
    //         }
    //     }
    //     fetchPosts();
    // }, [userName]); // Add userName as a dependency    


    return (
        <div>
            <AppBar />
            <Container maxWidth="xs" style={{ textAlign: 'center', paddingTop: '20px' }}>
                {/* Profile Icon */}
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
                    <AccountCircleIcon className="account-icon" style={{width: '80px', height: '80px'}} />
                </Box>

                {/* Stats */}
                <Box style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    <Card style={{ width: '45%', backgroundColor:'#BCBCBC' }}>
                        <CardContent>
                            <Typography variant="h6">Classes Rated</Typography>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>20</Typography>
                        </CardContent>
                    </Card>
                    <Card style={{ width: '45%', backgroundColor:'#BCBCBC' }}>
                        <CardContent>
                            <Typography variant="h6">Friends</Typography>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>87</Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Account Details */}
                <Box style={{ marginBottom: '20px', textAlign: 'left', width: '120%', justifyContent: 'center', alignItems: 'center', marginLeft: '-30px' }}>
                    <Typography variant="body1" style={{ fontWeight: 'bold', backgroundColor: '#2196f3', color: 'white', padding: '10px', borderRadius: '5px' }}>
                        {"Name: "}{userName?.displayName || "Unknown User"}
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 'bold', backgroundColor: '#4caf50', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                        {"Email: "}{userEmail || "No email available"}
                    </Typography>
                </Box>

                {/* Friend and Privacy Settings */}
                <Divider style={{ margin: '20px 0' }} />
                <Box>
                    <Button
                        variant="outlined"
                        endIcon={<EditIcon />}
                        onClick={() => navigate('/rating-history')}
                        style={{ marginBottom: '10px', width: '100%' }}
                        >
                        View Rating History
                    </Button >
                    <Button
                        variant="outlined"
                        endIcon={<EditIcon />}
                        style={{ marginBottom: '10px', width: '100%' }}
                    >
                        View Friend Activity
                    </Button>

                </Box>
                <Divider style={{ margin: '30px 0' }} />

                {/* Privacy Settings */}
                <Box style={{ textAlign: 'left' }}>
                    <Typography variant="body1" style={{ marginBottom: '10px' }}>
                        <Switch defaultChecked color="primary" /> Make Public Account
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        style={{ marginTop: '20px', width: '100%', marginBottom: '20px' }}
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
