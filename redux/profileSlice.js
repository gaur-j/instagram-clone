import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserByUsername, getUserPosts } from "../lib/userServices";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (username) => {
    const user = await getUserByUsername(username);
    const posts = user ? await getUserPosts(user.uid) : [];
    return { user, posts };
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: { user: null, posts: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProfile.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.posts = a.payload.posts;
      })
      .addCase(fetchProfile.rejected, (s) => {
        s.loading = false;
      });
  },
});

export default profileSlice.reducer;
