import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { Container, Box, Stack, Typography, Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
// import TextFields from '@mui/icons-material/TextFields';
import Post from '../Post/Post';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

function Comment({ userName, profilePic }) {
    console.log("userName: ", userName);
    // console.log("profilePic: ", profilePic);
    const navigate = useNavigate();
    const post_id = useParams().post_id;
    const [postInfo, setPostInfo] = useState(null);
    const [body, setBody] = useState("");
    const [fillInFields, setFillInFields] = useState(false);

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

    async function handleSubmit() {
        try {
            const collectionRef = collection(db, 'comments');
            const comment = {
                post_id: post_id,
                body: body,
                username: userName.displayName,
                profilePic: profilePic,
                date: new Date()
            };

            if (!body) {
                setFillInFields(true);
            } else {
                await addDoc(collectionRef, comment);
                navigate('/feed');
                console.log('Comment added!');
            }
        } catch (error) {
            console.error('Error adding comments:', error);
        }
    }

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
                        <TextField fullWidth label="Comment" onChange={(e) => setBody(e.target.value)}/>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
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