import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import apiClient from '../lib/axios';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
};

export const refreshSession = createAsyncThunk('auth/refreshSession', async (_, thunkAPI) => {
  if (!localStorage.getItem('token')) {
    return null;
  }

  try {
    const response = await apiClient.get('/api/auth/session');
    return response.data.user;
  } catch (error) {
    toast.error('Session expired. Please log in again.');
    localStorage.removeItem('token');
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, roletype }, thunkAPI) => {
    try {
      const response = await apiClient.post('/api/auth/login', { email, password, roletype });
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = localStorage.getItem('token');
        state.loading = false;
      })
      .addCase(refreshSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      });
  },
});

export const clearAuthState = authSlice.actions.logout;
export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(clearAuthState());
};

export default authSlice.reducer;
