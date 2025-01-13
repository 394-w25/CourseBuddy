import React from 'react';
import { Card, CardHeader, Avatar, IconButton, CardContent, CardActionArea, Typography, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import "./Post.css";

function Post( { post, friends } ) {
  return (
    <div>
        <Card className="post-card">
            <CardActionArea>
            <CardContent>
                <div className="chip-box">
                    <Chip label={post.course_name} color="info" />
                    <Chip label={post.quarter} color="warning" />
                    <Chip label={post.professor} color="secondary" />
                </div>
                <div className="post-header">
                    <Typography variant="h5" component="div" align="left" sx = {{fontWeight: 'bold'}} >
                        {post.title}
                    </Typography>
                    
                    <Typography variant="body2" align="left" sx={{ color: 'text.secondary'}}>
                        Posted by <b>{post.username}</b> on {post.date.toDate().toDateString()}
                    </Typography>
                </div>
                <div className="description-and-star">
                    <Typography align="left" variant="body1" sx={{ color: 'text.primary' }}>
                        {post.body}
                    </Typography>
                    <div style={{color: post.rating <= 2.5
                    ? 'red'
                    : post.rating >= 4
                    ? 'green'
                    : 'yellow', position: 'relative', display: 'inline-flex', alignItems: 'center'}}>
                        <StarBorderIcon style= {{fontSize: "100"}} />
                        <Typography variant="body2" className="star-text">
                            {post.rating}
                        </Typography>
                    </div>
                
                </div>
                

                <hr/>

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