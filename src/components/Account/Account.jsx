import { Box, Container, Typography, Button, Switch, Divider, Card, CardContent, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import NavigationBar from '../NavigationBar/NavigationBar';
import AppBar from '../AppBar/AppBar';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import "./Account.css";

function Account({ userName, userEmail, profilePic }) {
    const navigate = useNavigate();

    return (
        <div>
            <AppBar />
            <Container maxWidth="sm" style={{ textAlign: 'center', paddingTop: '20px' }}>
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
                    <Avatar sx={{ width: 80, height: 80 }} src={profilePic} />
                </Box>

                {/* Account Details */}
                <Box className="account-details">
                    <Typography variant="body1" style={{ fontWeight: 'bold', backgroundColor: '#2196f3', color: 'white', padding: '10px', borderRadius: '5px' }}>
                        {"Name: "}{userName?.displayName || "Unknown User"}
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 'bold', backgroundColor: '#4caf50', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
                        {"Email: "}{userEmail || "No email available"}
                    </Typography>
                </Box>

                {/* Stats */}
                <Box style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                    <Card style={{ width: '45%', backgroundColor:'#BCBCBC' }}>
                        <CardContent>
                            <Typography variant="subtitle1">Classes Rated:</Typography>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>20</Typography>
                        </CardContent>
                    </Card>
                    <Card style={{ width: '45%', backgroundColor:'#BCBCBC' }}>
                        <CardContent>
                            <Typography variant="subtitle1">Friends:</Typography>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>87</Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Friend and Privacy Settings */}
                <Divider style={{ margin: '20px 0' }} />
                <Box>
                    <Button
                        variant="outlined"
                        endIcon={<EditIcon />}
                        onClick={() => navigate('/rating-history')}
                        style={{ marginBottom: '10px', width: '100%' }}
                        >
                        View Rating History
                    </Button >
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
                        Sign Out
                    </Button>
                </Box>
            </Container>
            <NavigationBar />
        </div>
    );
}

export default Account;
