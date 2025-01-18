import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { Container, Box, Stack, Typography } from '@mui/material';
import AppBar from '../AppBar/AppBar';
import NavigationBar from '../NavigationBar/NavigationBar';
import Post from '../Post/Post';
import { useParams } from 'react-router-dom';

function Comment({ userName }) {
    const post_id = useParams().post_id;
    return (
        <div>
            <AppBar />
            <Container maxWidth="sm">
                <h1>Comments for {post_id}</h1>
            </Container>
        </div>
    )
}

export default Comment