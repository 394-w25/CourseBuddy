import Post from '../Post/Post';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { Container, Box, Stack, Typography } from '@mui/material';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import './RatingHistory.css';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from 'react';


function RatingHistory({ userName, filteredPost, setFilteredPost, likedPosts, setLikedPosts}) {

    const fake_friends = ["Alice", "Bob", "Charlie", "David"];
 // Add userName as a dependency to prevent it from running infinitely    

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
            <Container>
                <Container maxWidth="xs" style={{ textAlign: 'center', paddingTop: '20px' }}>
                </Container>

                <Container className="rating-history-page" maxWidth="sm">
                    <Box paddingBottom="30px">
                        <Stack spacing={3}>
                            { filteredPost.length === 0 ?
                                (<p>You haven't made any posts</p>) :
                                (filteredPost
                                    .slice()
                                    .sort((a, b) => b.date.seconds - a.date.seconds)
                                    .map((post) => 
                                      <div key={post.id}>
                                        <Post
                                          post={post}
                                          friends={fake_friends}
                                          postAnonymously={false}
                                          user={userName}
                                          likedPosts={likedPosts}  
                                          setLikedPosts={setLikedPosts}
                                        />
                                      </div>
                                    )
                                )
                            }
                        </Stack>
                    </Box>
                </Container>
                <NavigationBar />
            </Container>
        </div>
    );

}

export default RatingHistory;