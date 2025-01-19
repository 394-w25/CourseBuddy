import Post from '../Post/Post';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { useState, useEffect } from 'react';
import { Container, Box, Stack, Typography } from '@mui/material';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import './RatingHistory.css';
import Avatar from '@mui/material/Avatar';


function RatingHistory({ userName, profilePic }) {
    const [filteredPost, setFilteredPost] = useState([]);

    const fake_friends = ["Alice", "Bob", "Charlie", "David"];

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
                // console.log("Filtered posts: ", fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        }
        fetchPosts();
    }, [userName]); // Add userName as a dependency to prevent it from running infinitely    

    return (
        <div>
            <AppBar />
            <Container className='rating-history-page'>

                <Container maxWidth="xs" style={{ textAlign: 'center', paddingTop: '20px' }}>
                    <Box className="profile-box">

                        <Avatar sx={{ width: 80, height: 80 }} src={profilePic} />
                        <Typography variant="h5">{userName.displayName}</Typography> 
                    </Box>
                    <br />
                </Container>

                <Container maxWidth="sm">
                    <Box paddingBottom="30px">
                    <Stack spacing={3}>
                        { filteredPost.length === 0 ?
                            (<p>Loading posts...</p>) :
                            (filteredPost
                                .slice()
                                .sort((a, b) => b.date.seconds - a.date.seconds).map((post) => 
                                <div key={post.id}>
                                <Post post={post} friends={fake_friends} />
                                </div>)
                            )
                        }
                    </Stack>
                    </Box>
                </Container>
                <NavigationBar />
            </Container>
        </div>
    )

}

export default RatingHistory;