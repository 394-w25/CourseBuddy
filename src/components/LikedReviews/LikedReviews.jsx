import Post from '../Post/Post';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { Container, Box, Stack, Typography } from '@mui/material';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import { useEffect } from 'react';


function LikedReviews({ userName, profilePic, likedPosts, setLikedPosts, filteredLikedPosts, setFilteredLikedPosts }) {

    async function getPostsFromDB() {
        try {
            const querySnapshot = await getDocs(collection(db, "posts"));
            const posts = new Map();

            likedPosts.forEach((postid) => {
                // console.log("Post ID: ", postid);
                querySnapshot.forEach((doc) => {
                    if (postid === doc.id && !posts.has(doc.id)) {
                        posts.set(doc.id, { id: doc.id, ...doc.data() });
                    }
                });
            });
            return Array.from(posts.values());
        } catch (error) {
            console.log("Error: ", error);
            return [];
        }
    }
    
    useEffect(() => {
        async function fetchPosts() {
            // console.log("likedPosts: ", likedPosts);
            if (!likedPosts || likedPosts.length === 0) {
                setFilteredLikedPosts([]); // Ensure it's always an array
                return;
            }
    
            try {
                const fetchedPosts = await getPostsFromDB();
                setFilteredLikedPosts(fetchedPosts);
                // console.log("Filtered Liked Posts: ", fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        }
    
        fetchPosts();
    }, [likedPosts]); // Run effect when likedPosts change
    

    return (
        <div>
            <AppBar />
            <Container>

                <Container maxWidth="xs" style={{ textAlign: 'center', paddingTop: '20px' }}>
                </Container>

                <Container className="rating-history-page" maxWidth="sm">
                    <Box paddingBottom="30px">
                        <Stack spacing={3}>
                        { (!filteredLikedPosts || filteredLikedPosts.length === 0) ? (
                                <p>Loading posts...</p>
                            ) : (
                                filteredLikedPosts
                                    .slice()
                                    .sort((a, b) => b.date.seconds - a.date.seconds)
                                    .map((post) => (
                                        <div key={post.id}>
                                            <Post 
                                                user={userName?.uid} 
                                                post={post} 
                                                isPublic={0} 
                                                likedPosts={likedPosts} 
                                                setLikedPosts={setLikedPosts}
                                            />
                                        </div>
                                    ))
                            )}
                        </Stack>
                    </Box>
                </Container>
                <NavigationBar />
            </Container>
        </div>
    );

}

export default LikedReviews;