import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { Container, Box, Stack, Typography, Button, Divider, Avatar } from '@mui/material';
import TextField from '@mui/material/TextField';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import Post from '../Post/Post';
import { useParams } from 'react-router-dom';
import './Comment.css';

function Comment({ userName, profilePic }) {
    const post_id = useParams().post_id;
    const [postInfo, setPostInfo] = useState(null);
    const [body, setBody] = useState("");
    const [comments, setComments] = useState([]); 
    const [fillInFields, setFillInFields] = useState(false);

    // Fetch post information
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
            console.error("Error fetching post info: ", error);
        }
    }

    useEffect(() => {
        async function fetchPosts() {
            const fetchedPosts = await getPostInfoFromDB(post_id);
            setPostInfo(fetchedPosts);
        }
        fetchPosts();
    }, [post_id]);

    // Real-time comment listener
    useEffect(() => {
        const commentsRef = collection(db, "comments");
        const q = query(
            commentsRef,
            where("post_id", "==", post_id),
            orderBy("date", "asc") // Order comments by date
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newComments = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(newComments);
        });

        return () => unsubscribe(); // Clean up listener on component unmount
    }, [post_id]);

    // Handle new comment submission
    async function handleSubmit() {
        try {
            const collectionRef = collection(db, "comments");
            const comment = {
                post_id: post_id,
                body: body,
                username: userName.displayName,
                profilePic: profilePic,
                date: new Date(),
            };

            if (!body) {
                setFillInFields(true);
            } else {
                await addDoc(collectionRef, comment);
                setBody(""); // Clear the input field
                // console.log("Comment added!");
            }
        } catch (error) {
            console.error("Error adding comments:", error);
        }
    }

    return (
        <div>
            <AppBar />
            <Container className="comment-container" maxWidth="sm">
                {/* <Typography variant="h5" gutterBottom>
                    Comments for {post_id}
                </Typography> */}
                {postInfo ? (
                    <Post post={postInfo} friends={[]} />
                ) : (
                    <p>Loading post information...</p>
                )}
            </Container>

            {/* Comment Section */}
            <Container maxWidth="sm">

                <Divider style={{ margin: "20px 0" }} />

                {/* Display Comments */}
                <Box className="comments-list">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <Box key={comment.id} className="comment-item" style={{ marginBottom: "20px" }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar src={comment.profilePic} alt={comment.username} />
                                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                                        {comment.username}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(comment.date.seconds * 1000).toLocaleString()}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" style={{ marginTop: "10px" }}>
                                    {comment.body}
                                </Typography>
                                <Divider style={{ margin: "10px 0" }} />
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No comments yet. Be the first to comment!
                        </Typography>
                    )}
                </Box>

                <Box className="comment-box" style={{ marginTop: "20px" }}>
                    <Typography variant="h6">Add a Comment</Typography>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Write your comment"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Stack>
                </Box>
                <br />
            </Container>
            <NavigationBar />
        </div>
    );
}

export default Comment;
