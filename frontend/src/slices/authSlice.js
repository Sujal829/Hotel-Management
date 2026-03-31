import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Ensure this URL is correct (Check if it needs /api prefix)
const API_URL = '/api/auth';
axios.defaults.withCredentials = true;

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  isInitializing: true,
  error: null,
  tempToken: null, // Critical for verify-otp
};

// Helper to extract clean error messages from Axios
const getErrorMessage = (err) => err.response?.data?.message || err.message || 'An error occurred';

export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/request-otp`, userData);
      return response.data; // Should return { message, tempToken }
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  });

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData, { rejectWithValue }) => {
    try {
      // otpData MUST be { otp: "1234", tempToken: "..." }
      const response = await axios.post(`${API_URL}/verify-otp`, otpData);
      return response.data;
    } catch (err) {
      // This pulls the "Invalid OTP" message from your backend response
      return rejectWithValue(err.response?.data?.message || 'Verification failed');
    }
  }
);
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${API_URL}/logout`);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear errors when switching screens
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* --- Request OTP --- */
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.tempToken = action.payload.tempToken;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Now contains the real backend message
      })

      /* --- Verify OTP --- */
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.tempToken = null; // Clear it once logged in
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* --- Load User --- */
      .addCase(loadUser.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isInitializing = false;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isInitializing = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      /* --- Logout --- */
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.tempToken = null;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;