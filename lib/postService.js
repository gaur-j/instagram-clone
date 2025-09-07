// Firestore + posts CRUD + feed + likes + comments
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Create a post (image/video already uploaded to Cloudinary)
export const createPost = async ({
  userId,
  mediaUrl,
  mediaType = "image",
  caption = "",
}) => {
  const ref = collection(db, "posts");
  const postDoc = await addDoc(ref, {
    userId,
    mediaUrl, // Cloudinary URL
    mediaType, // "image" | "video"
    caption,
    likes: [],
    comments: [],
    createdAtServer: serverTimestamp(), //❌ Use server timestamp for accurate ordering
  });
  return postDoc.id;
};

// Get posts for a user's feed (their own + people they follow)
export const getFeedPosts = async ({
  userId,
  following = [],
  pageSize = 20,
}) => {
  const authorIds = Array.from(new Set([userId, ...following]));
  if (authorIds.length === 0) return [];

  // Firestore doesn't support "IN" with >10 items efficiently — batch if large
  const chunks = [];
  for (let i = 0; i < authorIds.length; i += 10)
    chunks.push(authorIds.slice(i, i + 10));

  const posts = [];
  for (const group of chunks) {
    const q = query(
      collection(db, "posts"),
      where("userId", "in", group),
      orderBy("createdAt", "desc")
      // limit(pageSize)
    );
    const snap = await getDocs(q);
    snap.forEach((d) => posts.push({ id: d.id, ...d.data() }));
  }

  // Sort again after merging chunks
  posts.sort(
    (a, b) =>
      (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
  );
  return posts;
};

// Get posts by user
export const getUserPosts = async (uid, pageSize = 30) => {
  const q = query(
    collection(db, "posts"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Toggle like
export const toggleLike = async ({ postId, uid, isLiked }) => {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, {
    likes: isLiked ? arrayRemove(uid) : arrayUnion(uid),
  });
};

// Add comment
export const addComment = async ({ postId, uid, text }) => {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, {
    comments: arrayUnion({
      uid,
      text,
      createdAt: Timestamp.now(),
    }),
  });
};
