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
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from "react-router-dom";

const courseClassMap = {
  CS: "chip-course-cs",
  PHYSICS: "chip-course-physics",
  GEN_ENG: "chip-course-gen_eng",
};

function getCourseChipClass(courseName) {
  console.log("courseName: ", courseName);
  const upper = courseName.toUpperCase();
  for (const prefix in courseClassMap) {
    if (upper.startsWith(prefix)) {
      return courseClassMap[prefix];
    }
  }
  return "";
}

function getQuarterChipClass(quarter) {
  const lower = quarter.toLowerCase();
  if (lower.includes("spring")) return "chip-quarter-spring";
  if (lower.includes("fall")) return "chip-quarter-fall";
  if (lower.includes("winter")) return "chip-quarter-winter";
  if (lower.includes("summer")) return "chip-quarter-summer";
  return "";
}

function Post({ post, friends }) {
  const navigate = useNavigate();
  const renderUserStars = (rating) => {
    const filledStars = Math.floor(rating);
    const starsArray = [];
    for (let i = 0; i < filledStars; i++) {
      starsArray.push(<StarIcon key={`u-filled-${i}`} className="star-icon-user" />);
    }
    for (let j = filledStars; j < 5; j++) {
      starsArray.push(<StarBorderIcon key={`u-empty-${j}`} className="star-icon-user" />);
    }
    return starsArray;
  };

  return (
    // Q: how to make the card clickable and navigate to comment page?
    <Card className="post-card" onClick={() => navigate(`/comment/${post.id}`)}>
      <CardActionArea>
        <CardContent>
          <div className="chip-box">
            <Chip label={post.course_name} className={getCourseChipClass(post.course_name)} />
            <Chip label={post.quarter} className={getQuarterChipClass(post.quarter)} />
            <Chip label={post.professor} className="chip-third" />
          </div>

          <div className="user-rating-section">
            <Typography variant="body2" className="user-rating-label">
              <strong>{post.username}</strong> rated this course
            </Typography>
            <div className="user-star-icons">
              {renderUserStars(post.rating ?? 0)}
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

          <div className="bottom-row">
            <div className="friends-section">
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
            </div>

            <div className="public-rating-container">
              <Typography variant="body2" className="public-rating-label">
                {(post.publicRatingCount ?? 1100).toLocaleString()} ratings
              </Typography>
              <div className="big-star-wrapper">
                <StarIcon className="big-star-icon" />
                <div className="big-star-text">
                  {post.publicRating ?? 3.5}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default Post;
