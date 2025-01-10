import React from 'react';
import { Card, CardHeader, Avatar, IconButton, CardContent, CardActionArea, Typography, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function Post( { post } ) {
  return (
    <div>
        <Card sx={{ maxWidth: 400 }}>
            <CardActionArea>
            <CardContent>
                <div>
                <Typography gutterBottom variant="h5" component="div" align="left" sx = {{fontWeight: 'bold'}} >
                    {post.title}
                <Avatar aria-label="recipe">
                    {post.user_name[0]}
                </Avatar>
                </Typography>
                <StarIcon/>
                </div>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {"Course: "}{post.course_name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {"rating: "}{post.rating}
                </Typography>
                <Chip label={`Professor: ${post.professor}`} color="primary" />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {"Quarter Taken: "}{post.quarter}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {post.comment}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {"Posted on: "}{post.date}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    </div>
  )
};

export default Post;