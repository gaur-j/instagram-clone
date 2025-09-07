import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set loading state to true when login is in progress
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Set the current user when login is successful
    login: (state, action) => {
      const { uid, email, displayName, photoURL } = action.payload;
      state.currentUser = { uid, email, displayName, photoURL };
      state.loading = false; // Reset loading state after login
    },
    // Clear current user on logout
    logout: (state) => {
      state.currentUser = null;
      state.loading = false; // Reset loading state after logout
    },
  },
});
export const { login, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;
