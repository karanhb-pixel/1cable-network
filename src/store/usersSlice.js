import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_ROOT ;

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      const response = await axios.get(`${API_BASE}/iws/v1/users`, {
        headers: { Authorization: `Bearer ${token}` },
             });
      // console.log("response data in fetchUsers: ", response.data);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      // Change the URL to include the user_id as a query parameter
      const response = await axios.get(`${API_BASE}/iws/v1/users?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // The API now returns an array, so return it as-is.
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      const response = await axios.post(`${API_BASE}/iws/v1/users`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      
      // Update the URL to include the user ID as a path parameter.
      // This matches the new PUT endpoint: `/users/(?P<id>\d+)`
      const response = await axios.put(`${API_BASE}/iws/v1/users/${id}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log("Deleting user with ID:", id);
      
      const token = getState().auth.user.token;
      
      // Update the URL to include the user ID as a path parameter.
      await axios.delete(`${API_BASE}/iws/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Return the ID of the deleted user for state management
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  allUsers: [],
  currentUser: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.currentUser = null;
      })
      // addUser
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = state.allUsers.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = state.allUsers.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default usersSlice.reducer;

export const selectAllUsers = (state) => state.users.allUsers;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectLoading = (state) => state.users.loading;
export const selectError = (state) => state.users.error;