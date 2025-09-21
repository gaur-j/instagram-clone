import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPost,
  getFeedPosts,
  toggleLike as toggleLikeService,
  addComment as addCommentService,
} from "../lib/postService";

// Publish new post
export const publishPost = createAsyncThunk(
  "posts/publishPost",
  async ({ userId, mediaUrl, mediaType, caption }) => {
    const id = await createPost({ userId, mediaUrl, mediaType, caption });
    return {
      id,
      userId,
      mediaUrl,
      mediaType,
      caption,
      likes: [],
      comments: [],
      createdAt: Date.now(), // placeholder until Firestore returns
    };
  }
);

// Fetch feed
export const fetchFeed = createAsyncThunk("posts/fetchFeed", async () => {
  return await getFeedPosts();
});

// Toggle like
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId, uid, isLiked }) => {
    await toggleLikeService({ postId, uid, isLiked });
    return { postId, uid, isLiked };
  }
);

// Add comment
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, uid, text }) => {
    await addCommentService({ postId, uid, text });
    return { postId, uid, text, createdAt: Date.now() };
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    feed: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Publish
      .addCase(publishPost.fulfilled, (s, a) => {
        s.feed = [a.payload, ...s.feed];
      })
      // Fetch
      .addCase(fetchFeed.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (s, a) => {
        s.loading = false;
        s.feed = a.payload || [];
      })
      .addCase(fetchFeed.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })
      // Likes
      .addCase(toggleLike.fulfilled, (s, a) => {
        const { postId, uid, isLiked } = a.payload;
        const post = s.feed.find((p) => p.id === postId);
        if (post) {
          if (isLiked) {
            post.likes = post.likes.filter((id) => id !== uid);
          } else {
            post.likes.push(uid);
          }
        }
      })
      // Comments
      .addCase(addComment.fulfilled, (s, a) => {
        const { postId, uid, text, createdAt } = a.payload;
        const post = s.feed.find((p) => p.id === postId);
        if (post) {
          post.comments.push({ uid, text, createdAt });
        }
      });
  },
});

export default postsSlice.reducer;
