import React from 'react';
import { Box, Container, Typography, Button, Switch, Divider, Card, CardContent, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NavigationBar from '../NavigationBar/NavigationBar';

function Account({userName, userEmail}) {
    return (
        <div>
            <Container maxWidth="xs" style={{ textAlign: 'center', paddingTop: '20px' }}>
                {/* Title */}
                <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Course Buddy
                </Typography>

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
                    
                </Box>

                {/* Stats */}
                <Box style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    <Card style={{ width: '45%' }}>
                        <CardContent>
                            <Typography variant="h6">Classes Rated</Typography>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>20</Typography>
                        </CardContent>
                    </Card>
                    <Card style={{ width: '45%' }}>
                        <CardContent>
                            <Typography variant="h6">Friends</Typography>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>87</Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Account Details */}
                <Box style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <Typography variant="body1" style={{ fontWeight: 'bold', backgroundColor: '#2196f3', color: 'white', padding: '10px', borderRadius: '5px' }}>
                        {userName?.displayName || "Unknown User"}
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 'bold', backgroundColor: '#4caf50', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                        {userEmail || "No email available"}
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 'bold', backgroundColor: '#f44336', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                        Major: Computer Science
                    </Typography>
                </Box>

                {/* Friend and Privacy Settings */}
                <Divider style={{ margin: '20px 0' }} />
                <Box>
                    <Button
                        variant="outlined"
                        endIcon={<EditIcon />}
                        style={{ marginBottom: '10px', width: '100%' }}
                    >
                        View Rating History
                    </Button>
                    <Button
                        variant="outlined"
                        endIcon={<EditIcon />}
                        style={{ marginBottom: '10px', width: '100%' }}
                    >
                        View Friend Activity
                    </Button>
                </Box>
                <Divider style={{ margin: '20px 0' }} />

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
                        Delete Account
                    </Button>
                </Box>
            </Container>
            <NavigationBar />
        </div>
    );
}

export default Account;
