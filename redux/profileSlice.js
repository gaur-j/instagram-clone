import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { followUser, unfollowUser } from "@/lib/profileService";

export const followThunk = createAsyncThunk(
  "profile/follow",
  async ({ currentUid, targetUid }, { rejectWithValue }) => {
    try {
      await followUser({ currentUid, targetUid });
      return { currentUid, targetUid };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const unfollowThunk = createAsyncThunk(
  "profile/unfollow",
  async ({ currentUid, targetUid }, { rejectWithValue }) => {
    try {
      await unfollowUser({ currentUid, targetUid });
      return { currentUid, targetUid };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: { viewing: null, loading: false },
  reducers: {
    setViewingProfile: (s, a) => {
      s.viewing = a.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(followThunk.fulfilled, (s, a) => {
      if (s.viewing?.uid === a.payload.targetUid)
        s.viewing.followers?.push?.(a.payload.currentUid);
    });
    b.addCase(unfollowThunk.fulfilled, (s, a) => {
      if (s.viewing?.uid === a.payload.targetUid)
        s.viewing.followers = (s.viewing.followers || []).filter(
          (x) => x !== a.payload.currentUid
        );
    });
  },
});

export const { setViewingProfile } = profileSlice.actions;
export default profileSlice.reducer;
