import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import "./Post.css";

function Post({ post, friends }) {
  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const starsArray = [];
    for (let i = 0; i < filledStars; i++) {
      starsArray.push(
        <StarIcon key={`filled-${i}`} className="star-icon" />
      );
    }
    for (let j = filledStars; j < 5; j++) {
      starsArray.push(
        <StarBorderIcon key={`empty-${j}`} className="star-icon" />
      );
    }
    return starsArray;
  };

  return (
    <Card className="post-card">
      <CardContent>
        <div className="chip-box">
          <Chip label={post.course_name} className="chip-first" />
          <Chip label={post.quarter} className="chip-second" />
          <Chip label={post.professor} className="chip-third" />
        </div>
        <div className="ratings-row">
          <Typography variant="body2" className="rating-count">
            {post.totalRatings || 123} ratings
          </Typography>
          <div className="star-icons">
            {renderStars(post.rating ?? 4)}
          </div>
        </div>
        <Typography variant="h5" component="div" className="post-title">
          {post.title}
        </Typography>
        <Typography variant="body2" className="post-subheader">
          Posted by <strong>{post.username}</strong> on {post.date.toDate().toDateString()}
        </Typography>
        <Typography variant="body1" className="post-body">
          {post.body}
        </Typography>
        <hr className="divider" />
        <Typography variant="body2" className="friends-text">
          Friends who enrolled
        </Typography>
        <div className="friends-avatar">
          {Object.values(friends).map((friend) => (
            <Avatar key={friend} aria-label="recipe">
              {friend[0]}
            </Avatar>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Post;
