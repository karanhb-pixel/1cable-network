import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        sessionStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        sessionStorage.removeItem('user');
      }
    },
    login: (state, action) => {
      state.user = action.payload;
      sessionStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      sessionStorage.removeItem('user');
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;