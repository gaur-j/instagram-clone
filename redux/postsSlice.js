import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPost,
  getFeedPosts,
  toggleLike,
  addComment,
} from "@/lib/postService";

export const fetchFeed = createAsyncThunk(
  "posts/fetchFeed",
  async ({ userId, following }, { rejectWithValue }) => {
    try {
      return await getFeedPosts({ userId, following });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const publishPost = createAsyncThunk(
  "posts/publishPost",
  async ({ userId, mediaUrl, mediaType, caption }, { rejectWithValue }) => {
    try {
      const id = await createPost({
        userId,
        mediaUrl,
        mediaType,
        caption,
      });
      return {
        id,
        userId,
        mediaUrl,
        mediaType,
        caption,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
      };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const togglePostLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId, uid, isLiked }, { rejectWithValue }) => {
    try {
      await toggleLike({ postId, uid, isLiked });
      return { postId, uid, isLiked };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const addPostComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, uid, text }, { rejectWithValue }) => {
    try {
      await addComment({ postId, uid, text });
      return { postId, uid, text, createdAt: Date.now() };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: { feed: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchFeed.fulfilled, (s, a) => {
        s.loading = false;
        s.feed = a.payload;
      })
      .addCase(fetchFeed.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(publishPost.fulfilled, (s, a) => {
        s.feed = [a.payload, ...s.feed];
      })
      .addCase(togglePostLike.fulfilled, (s, a) => {
        const { postId, uid, isLiked } = a.payload;
        const p = s.feed.find((p) => p.id === postId);
        if (!p) return;
        if (isLiked) {
          p.likes = p.likes.filter((x) => x !== uid);
        } else {
          p.likes = [...p.likes, uid];
        }
      })
      .addCase(addPostComment.fulfilled, (s, a) => {
        const { postId, uid, text, createdAt } = a.payload;
        const p = s.feed.find((p) => p.id === postId);
        if (!p) return;
        p.comments = [...(p.comments || []), { uid, text, createdAt }];
      });
  },
});

export default postSlice.reducer;
