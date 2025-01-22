import Post from '../Post/Post';
import { Container, Box, Stack, Typography } from '@mui/material';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import './RatingHistory.css';
import Avatar from '@mui/material/Avatar';


function RatingHistory({ userName, profilePic, filteredPost }) {

    const fake_friends = ["Alice", "Bob", "Charlie", "David"];
 // Add userName as a dependency to prevent it from running infinitely    

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
                                (<p>Loading posts...</p>) :
                                (filteredPost
                                    .slice()
                                    .sort((a, b) => b.date.seconds - a.date.seconds).map((post) => 
                                    <div key={post.id}>
                                    <Post post={post} friends={fake_friends} postAnonymously={false}/>
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