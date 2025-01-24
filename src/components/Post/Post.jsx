import React from 'react';
import { useNavigate } from "react-router-dom";
import { Avatar, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
// import Heart from "react-animated-heart";
import Heart from "react-heart";
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import "./Post.css";
import { set } from 'firebase/database';

const courseClassMap = {
  CS: "post-bar-cs",
  PHYSICS: "post-bar-physics",
  GEN_ENG: "post-bar-gen_eng",
};

function getCourseBarClass(courseName) {
  const upper = (courseName || "").toUpperCase();
  for (const prefix in courseClassMap) {
    if (upper.startsWith(prefix)) {
      return courseClassMap[prefix];
    }
  }
  return "";
}

function getQuarterClass(quarter) {
  const lower = (quarter || "").toLowerCase();
  if (lower.includes("summer")) return "post-quarter-summer";
  if (lower.includes("winter")) return "post-quarter-winter";
  if (lower.includes("fall")) return "post-quarter-fall";
  if (lower.includes("spring")) return "post-quarter-spring";
  return "";
}

function renderUserStars(rating) {
  const full = Math.floor(rating);
  return [...Array(5)].map((_, index) =>
    index < full ? <StarIcon key={index} className="star-icon-user filled-user-star" /> : <StarBorderIcon key={index} className="star-icon-user empty-user-star" />
  );
}

function renderCourseStars(rating) {
  const full = Math.floor(rating);
  return [...Array(5)].map((_, index) =>
    index < full ? <StarIcon key={index} className="star-icon-course filled-course-star" /> : <StarBorderIcon key={index} className="star-icon-course empty-course-star" />
  );
}

function abbreviateCount(num) {
  if (num < 1000) return num;
  const val = Math.floor(num / 100) / 10;
  return val < 10 ? `${val}k` : `${Math.round(val)}k`;
}

function Post({ post, isPublic, setLikedPosts }) {
  const navigate = useNavigate();

  // Show anonymous name only for public feed, otherwise show actual username
  const userName = isPublic && post.anonymous ? "Anonymous" : post.username;

  const userRating = post.rating ?? 0;
  const dateStr = post.date.toDate().toDateString();
  const publicRating = post.publicRating ?? 3.5;
  const publicCount = abbreviateCount(post.publicRatingCount ?? 1100);
  const friendCount = post.friendCount ?? 2;
  // const [isLiked, setIsLiked] = React.useState(false);
  const [active, setActive] = React.useState(false);

  function handleLikedPost(post, setActive, setLikedPosts) {
    setActive(!active);
    console.log("Liked post: ", post.id);
    setLikedPosts((prevLikedPosts) => {
      if (active) {
        console.log("Unliking post: ", post.id);
        return prevLikedPosts.filter((likedPost) => likedPost !== post.id);
      } else {
        return [...prevLikedPosts, post.id];
      }
    })
  }

  return (
    <div className="post-wrapper" onClick={() => navigate(`/comment/${post.id}`)}>
      <div className={`post-top-bar ${getCourseBarClass(post.course_name)}`}>
        <h3 className="post-course-name">{post.course_name}</h3>
      </div>

      <div className="post-body-container">
        <div className="post-chips-row">
          <Chip label={post.quarter} className={`post-chip ${getQuarterClass(post.quarter)}`} />
          <Chip label={post.professor} className="post-chip" />
        </div>

        <div className="post-user-section">
          <Avatar className="post-avatar" src={post.userPhotoURL || ""} />
          <div className="post-user-info">
            <div className="post-user-name">{userName}</div>
            <div className="post-user-stars">{renderUserStars(userRating)}</div>
          </div>
        </div>

        <div className="post-date">{dateStr}</div>
        <div className="post-title">{post.title}</div>
        <div className="post-body-text">{post.body}</div>

        <hr className="post-divider" />

        <div className="post-bottom-row">
          <div className="post-course-ratings">
            <div className="post-course-ratings-label">
              <strong>{publicCount}</strong> students rated this course
            </div>
            <div className="post-course-stars">{renderCourseStars(publicRating)}</div>
          </div>

          <div className="post-friends-like">
            <div className="post-friend-count">
              <strong>{friendCount} friends</strong> took this course
            </div>
            <div className="post-icons">
              <ModeCommentOutlinedIcon className="post-icon" />
              <Heart className="heart-icon" isActive={active} onClick={() => {
                handleLikedPost(post, setActive, setLikedPosts)}
               } />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Post;
