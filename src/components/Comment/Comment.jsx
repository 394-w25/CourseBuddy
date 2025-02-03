import { useState, useEffect } from 'react';
import {
  collection, getDocs, addDoc, query,
  where, orderBy, onSnapshot
} from "firebase/firestore";
import { db } from "../../utilities/firebase";
import {
  Container, Box, Stack, Typography, Button,
  Divider, Avatar, TextField
} from '@mui/material';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import Post from '../Post/Post';
import { useParams } from 'react-router-dom';
import './Comment.css';

function Comment({ userName, profilePic, likedPosts, setLikedPosts }) {
  const post_id = useParams().post_id;
  const [postInfo, setPostInfo] = useState(null);
  const [body, setBody] = useState("");
  const [comments, setComments] = useState([]);
  const [fillInFields, setFillInFields] = useState(false);

  async function getPostInfoFromDB(post_id) {
    try {
      const docSnap = await getDocs(collection(db, "posts"));
      const posts = [];
      docSnap.forEach((doc) => {
        if (doc.id === post_id) {
          // If the doc is anonymous, we override the username with "Anonymous"
          const data = doc.data();
          posts.push({
            id: doc.id,
            ...data,
            username: data.anonymous ? "Anonymous" : data.username
          });
        }
      });
      return posts[0];
    } catch (error) {
      console.error("Error fetching post info: ", error);
    }
  }

  useEffect(() => {
    async function fetchPost() {
      const fetched = await getPostInfoFromDB(post_id);
      setPostInfo(fetched);
    }
    fetchPost();
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

    return () => unsubscribe();
  }, [post_id]);

  // Handle new comment submission
  async function handleSubmit() {
    if (!body) {
      setFillInFields(true);
      return;
    }

    try {
      const collectionRef = collection(db, "comments");
      const comment = {
        post_id: post_id,
        body: body,
        username: userName.displayName,
        profilePic: profilePic,
        date: new Date(),
      };

      await addDoc(collectionRef, comment);
      setBody("");
    } catch (error) {
      console.error("Error adding comments:", error);
    }
  }

  return (
    <div>
      <AppBar />

      <Container className="post-container" maxWidth="sm">
        {postInfo ? (
          <Post
            post={postInfo}
            user={userName}
            likedPosts={likedPosts}
            setLikedPosts={setLikedPosts}
            friends={[]}
            isPublic={true}
          />
        ) : (
          <p>Loading post information...</p>
        )}
      </Container>

      {/* Comment Section */}
      <Container className="comment-container" maxWidth="sm">
        <Divider sx={{ margin: "20px 0" }} />

        {/* Display Comments */}
        <Box className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Box key={comment.id} className="comment-item" sx={{ marginBottom: "20px" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={comment.profilePic} alt={comment.username} />
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {comment.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(comment.date.seconds * 1000).toLocaleString()}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ marginTop: "10px" }}>
                  {comment.body}
                </Typography>
                <Divider sx={{ margin: "10px 0" }} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>

        <Box className="comment-box" sx={{ marginTop: "20px" }}>
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
