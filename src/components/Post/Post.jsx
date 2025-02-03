import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Avatar, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Heart from "react-heart";
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import "./Post.css";
import {
  doc, updateDoc, arrayUnion, arrayRemove,
  collection, query, where, getDocs
} from "firebase/firestore";
import { db } from "../../utilities/firebase";
import { SUBJECT_COLORS } from '../../utilities/subjectData';

function getCourseColor(courseName) {
  if (!courseName) return "#8c5ed1"; 
  const subject = courseName.split(" ")[0]?.toUpperCase();
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
  return [...Array(5)].map((_, i) =>
    i < full
      ? <StarIcon key={i} className="star-icon-user filled-user-star" />
      : <StarBorderIcon key={i} className="star-icon-user empty-user-star" />
  );
}

function renderCourseStars(rating) {
  const full = Math.floor(rating);
  return [...Array(5)].map((_, i) =>
    i < full
      ? <StarIcon key={i} className="star-icon-course filled-course-star" />
      : <StarBorderIcon key={i} className="star-icon-course empty-course-star" />
  );
}

function abbreviateCount(num) {
  if (!num) return 0;
  if (num < 1000) return num;
  const val = Math.floor(num / 100) / 10;
  return val < 10 ? `${val}k` : `${Math.round(val)}k`;
}

export default function Post({
  user,
  post,
  isPublic = false,   // default false
  likedPosts = [],
  setLikedPosts = () => {}
}) {
  const navigate = useNavigate();

  // If user is anonymous on a public feed, show "Anonymous" instead of real username
  const displayName = (isPublic && post.anonymous)
    ? "Anonymous"
    : post.username || "Unknown User";

  // Hide the real avatar if post is anonymous on a public feed
  // Fallback is an empty string => default avatar
  const avatarSrc = (isPublic && post.anonymous)
    ? ""
    : (post.authorPhotoURL || "");

  const userRating = post.rating ?? 0;
  const dateStr    = post.date?.toDate().toDateString() || "";
  
  const [active, setActive] = useState(false);
  const [courseAvgRating, setCourseAvgRating] = useState(0);
  const [courseRatingCount, setCourseRatingCount] = useState(0);

  useEffect(() => {
    if (Array.isArray(likedPosts) && likedPosts.includes(post.id)) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [likedPosts, post.id]);

  // average rating among all posts for this course_name
  useEffect(() => {
    if (!post.course_name) return;
    async function fetchCourseRating() {
      try {
        const q = query(
          collection(db, "posts"),
          where("course_name", "==", post.course_name)
        );
        const snapshot = await getDocs(q);
        let total = 0;
        let count = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (typeof data.rating === "number") {
            total += data.rating;
            count += 1;
          }
        });
        if (count > 0) {
          setCourseAvgRating(total / count);
          setCourseRatingCount(count);
        } else {
          setCourseAvgRating(0);
          setCourseRatingCount(0);
        }
      } catch (err) {
        console.error("Error fetching course average rating:", err);
      }
    }
    fetchCourseRating();
  }, [post.course_name]);

  // Toggle like/unlike
  async function handleLikedPost() {
    if (!user?.uid) {
      console.warn("Cannot like/unlike: user not signed in or missing uid.");
      return;
    }
    const docRef = doc(db, "users", user.uid);
    try {
      if (active) {
        await updateDoc(docRef, {
          likedPosts: arrayRemove(post.id),
        });
        setLikedPosts((prev) =>
          Array.isArray(prev) ? prev.filter((id) => id !== post.id) : []
        );
      } else {
        await updateDoc(docRef, {
          likedPosts: arrayUnion(post.id),
        });
        setLikedPosts((prev) =>
          Array.isArray(prev) ? [...prev, post.id] : [post.id]
        );
      }
      setActive(!active);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  return (
    <div className="post-wrapper">
      <a className="class-page-link-button" href={`/course/${post.course_name.replace(/\s/g,'')}`}>
        <div
          className="post-top-bar"
          style={{ backgroundColor: getCourseColor(post.course_name) }}
        >
          <h3 className="post-course-name">{post.course_name}</h3>
        </div>
      </a>

      <div className="post-body-container">
        <div className="post-chips-row">
          <Chip
            label={post.quarter}
            className={`post-chip ${getQuarterClass(post.quarter)}`}
          />
          <Chip label={post.professor} className="post-chip" />
        </div>

        <div className="post-user-section">
          <Avatar
            className="post-avatar"
            src={avatarSrc}
          />
          <div className="post-user-info">
            <div className="post-user-name">{displayName}</div>
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
              <strong>{abbreviateCount(courseRatingCount)}</strong> ratings for {post.course_name}
            </div>
            <div className="post-course-stars">
              {renderCourseStars(courseAvgRating)}
            </div>
          </div>

          <div className="post-friends-like">
            <div className="post-icons">
              <ModeCommentOutlinedIcon
                className="comment-icon"
                onClick={() => navigate(`/comment/${post.id}`)}
              />
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
