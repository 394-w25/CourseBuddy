import React from 'react';
import { Card, CardHeader, Avatar, IconButton, CardContent, CardActionArea, Typography, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import "./Post.css";

function Post( { post, friends } ) {
  return (
    <div>
        <Card sx={{ maxWidth: 400 }}>
            <CardActionArea>
            <CardContent>
                <div className="post-header">
                    <Typography variant="h5" component="div" align="left" sx = {{fontWeight: 'bold'}} >
                        {post.title}
                    </Typography>
                    <div className="user-box" style={{ display: 'flex', alignItems: 'right', gap: '5px' }} >
                        <Avatar aria-label="recipe">
                            {post.user_name[0]}
                        </Avatar>
                        <Typography> {post.user_name} </Typography>
                    </div>
                </div>
                <div className="post-subheader">
                        <Typography variant="subtitle2" align="left">Professor: {post.professor}</Typography>
                        <Typography variant="subtitle2" align="left">Course: {post.course_name}</Typography>
                        <Typography variant="subtitle2" align="left">Quarter: {post.quarter}</Typography>
                </div>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {"rating: "}{post.rating}
                </Typography>
                <div style={{ color: 'gold', position: 'relative', display: 'inline-flex', alignItems: 'center'}}>
                    <StarBorderIcon style= {{fontSize: "large"}} />
                    <Typography
                        variant="body2"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontWeight: 'bold',
                            fontSize: 20
                        }}
                    >
                        {5}
                    </Typography>
                </div>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {post.comment}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {"Posted on:"} {post.date}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {"These friends rated this class too: "}
                </Typography>
                <div className="friends-avatar" align="center">
                    {Object.values(friends).map((friend) => {
                        return (
                            <Avatar key={friend} aria-label="recipe">
                                {friend[0]}
                            </Avatar>
                        );
                    })}
                </div>

            </CardContent>
            </CardActionArea>
        </Card>
    </div>
  )
};

export default Post;