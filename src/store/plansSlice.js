import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_ROOT;

export const fetchWifiPlans = createAsyncThunk(
  'plans/fetchWifiPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ROOT}/wifi-plans`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOttPlans = createAsyncThunk(
  'plans/fetchOttPlans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ROOT}/ott-plans`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  wifiPlans: [],
  ottPlans: [],
  loading: false,
  error: null,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWifiPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWifiPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.wifiPlans = action.payload;
      })
      .addCase(fetchWifiPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOttPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOttPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.ottPlans = action.payload;
      })
      .addCase(fetchOttPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = plansSlice.actions;
export default plansSlice.reducer;

export const selectWifiPlans = (state) => state.plans.wifiPlans;
export const selectOttPlans = (state) => state.plans.ottPlans;
export const selectPlansLoading = (state) => state.plans.loading;
export const selectPlansError = (state) => state.plans.error;