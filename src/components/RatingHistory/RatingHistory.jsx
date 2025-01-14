import Post from '../Post/Post';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { useState, useEffect } from 'react';
import { Container, Box, Stack } from '@mui/material';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';


function RatingHistory({ userName }) {
    const [filteredPost, setFilteredPost] = useState([]);

    const fake_friends = ["Alice", "Bob", "Charlie", "David"];

    async function getPostsFromDB() {
        try {
            const querySnapshot = await getDocs(collection(db, "posts"));
            const posts = [];
            querySnapshot.forEach((doc) => {
                // console.log("doc status before pushing: ", doc.data());
                // console.log("username: ", doc.data().username);
                // console.log("displayName: ", userName.displayName);
                if (doc.data().username === userName?.displayName){
                    posts.push({ id: doc.id, ...doc.data() });
                }
            });
            //const filteredPosts = posts.filter(post => post.username === userName?.displayName);
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
                console.log("Filtered posts: ", fetchedPosts);
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        }
        fetchPosts();
    }, [userName]); // Add userName as a dependency    

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
                    {/* Profile Name */}
                    <h1>{userName.displayName}</h1>
                    {/* Profile Email */}
                    <p>{userName.email}</p>
                </Box>
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
        </div>
    )

}

export default RatingHistory;