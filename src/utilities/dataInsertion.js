import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

// For future reference, provide the template below to GPT to generate fake posts
const fakePosts = [
    {
        body: "I really enjoyed taking CS101. The projects were challenging but rewarding!",
        course_name: "CS101",
        date: new Date("2025-01-05T16:45:00Z"), // Use a valid JS Date object
        professor: "Prof. Smith",
        quarter: "Winter 2025",
        rating: "4",
        title: "Challenging but Great!",
        username: "alice123"
    },
    {
        body: "CS202 was well-organized, and I learned a lot about algorithms.",
        course_name: "CS202",
        date: new Date("2025-01-06T20:15:00Z"),
        professor: "Prof. Johnson",
        quarter: "Winter 2025",
        rating: "5",
        title: "Loved the Course!",
        username: "bob456"
    },
    {
        body: "The course material for CS303 was outdated, but the professor was great.",
        course_name: "CS303",
        date: new Date("2025-01-07T15:30:00Z"),
        professor: "Prof. Lee",
        quarter: "Winter 2025",
        rating: "3",
        title: "Mixed Feelings",
        username: "charlie789"
    }
];
  
async function addPosts() {
    const collectionRef = collection(db, 'posts'); // Correct Firestore reference
  
    for (const post of fakePosts) {
      try {
        await addDoc(collectionRef, post); // Use addDoc instead of add
        console.log(`Added post: ${post.title}`);
      } catch (error) {
        console.error('Error adding post:', error);
      }
    }
}

// run `node dataInsertion.js` to add the fake posts to the database
addPosts();