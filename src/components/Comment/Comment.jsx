import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { Container, Box, Stack, Typography, Button, Textfield } from '@mui/material';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
// import TextFields from '@mui/icons-material/TextFields';
import Post from '../Post/Post';
import { useParams } from 'react-router-dom';

function Comment({ userName }) {
    const post_id = useParams().post_id;
    const [postInfo, setPostInfo] = useState(null);

    async function getPostInfoFromDB(post_id) {
        try {
            const doc = await getDocs(collection(db, "posts"));
            const posts = [];
            doc.forEach((doc) => {
                if (doc.id === post_id) {
                    posts.push({ id: doc.id, ...doc.data() });
                }
            });
            return posts[0];
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useEffect(() => {
        async function fetchPosts() {
            try {
                const fetchedPosts = await getPostInfoFromDB(post_id);
                setPostInfo(fetchedPosts);
            }
            catch (error) {
                console.error("Error fetching posts: ", error);
            }
        }
        fetchPosts();
    }, [post_id]);

    return (
        <div>
            <AppBar />
            <Container maxWidth="sm">
                <p>Comments for {post_id}</p>
                {postInfo ? (
                    <Post post={postInfo} friends={[]} />
                ) : (
                    <p>Loading post information...</p>
                )}
            </Container>

            <Container maxWidth="sm">
                <Box className="comment-box">
                    <Typography variant="h6">Add a Comment</Typography>
                    <Stack spacing={2}>
                        <TextField
                            label="Comment"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                        />
                        <Button variant="contained" color="primary">
                            Submit
                        </Button>
                    </Stack>
                </Box>
            </Container>
            <NavigationBar />
        </div>
    )
}

export default Comment