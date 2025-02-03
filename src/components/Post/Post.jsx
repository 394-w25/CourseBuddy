import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Avatar, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Heart from "react-heart";
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import "./Post.css";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../utilities/firebase";

import { SUBJECT_COLORS } from '../../utilities/subjectData';

function getCourseColor(courseName) {
  if (!courseName) return "#8c5ed1"; // fallback color if for some reason courseName is missing

  const subject = courseName.split(" ")[0].toUpperCase();
  // Look up the subject color, or default if not found
  return SUBJECT_COLORS[subject] || "#8c5ed1";
}

function getQuarterClass(quarter) {
  const lower = (quarter || "").toLowerCase();
  if (lower.includes("summer")) return "post-quarter-summer";
  if (lower.includes("winter")) return "post-quarter-winter";
  if (lower.includes("fall"))   return "post-quarter-fall";
  if (lower.includes("spring")) return "post-quarter-spring";
  return "";
}

function renderUserStars(rating) {
  const full = Math.floor(rating);
  return [...Array(5)].map((_, index) =>
    index < full
      ? <StarIcon key={index} className="star-icon-user filled-user-star" />
      : <StarBorderIcon key={index} className="star-icon-user empty-user-star" />
  );
}

function renderCourseStars(rating) {
  const full = Math.floor(rating);
  return [...Array(5)].map((_, index) =>
    index < full
      ? <StarIcon key={index} className="star-icon-course filled-course-star" />
      : <StarBorderIcon key={index} className="star-icon-course empty-course-star" />
  );
}

function abbreviateCount(num) {
  if (!num) return 0;
  if (num < 1000) return num;
  const val = Math.floor(num / 100) / 10;
  return val < 10 ? `${val}k` : `${Math.round(val)}k`;
}

function Post({ user, post, isPublic, likedPosts, setLikedPosts }) {
  const navigate = useNavigate();

  // Show “Anonymous” name only if public feed + post.anonymous
  const userName = isPublic && post.anonymous ? "Anonymous" : post.username;

  const userRating = post.rating ?? 0;
  const dateStr = post.date.toDate().toDateString();
  const publicRating = post.publicRating ?? 3.5;
  const publicCount = abbreviateCount(post.publicRatingCount ?? 1100);
  const friendCount = post.friendCount ?? 2;

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (likedPosts.includes(post.id)) {
      setActive(true);
    }
  }, [likedPosts, post.id]);

  async function handleLikedPost(e) {
    e.stopPropagation(); // so we don't navigate to the comments when clicking heart
    const docRef = doc(db, "users", user.uid);

    try {
      if (active) {
        // unlike
        await updateDoc(docRef, {
          likedPosts: arrayRemove(post.id)
        });
        setLikedPosts(prev => prev.filter(id => id !== post.id));
      } else {
        // like
        await updateDoc(docRef, {
          likedPosts: arrayUnion(post.id)
        });
        setLikedPosts(prev => [...prev, post.id]);
      }
      setActive(!active);
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  }

  return (
    <div
      className="post-wrapper"
      onClick={() => navigate(`/comment/${post.id}`)}
    >
      {/* Inline style for color */}
      <div
        className="post-top-bar"
        style={{ backgroundColor: getCourseColor(post.course_name) }}
      >
        <h3 className="post-course-name">{post.course_name}</h3>
      </div>

      <div className="post-body-container">
        <div className="post-chips-row">
          <Chip
            label={post.quarter}
            className={`post-chip ${getQuarterClass(post.quarter)}`}
          />
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
              <Heart
                className="heart-icon"
                isActive={active}
                onClick={handleLikedPost}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
