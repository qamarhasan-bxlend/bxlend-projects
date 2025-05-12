import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface UserState {
  user: object;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: {},
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk('user', async () => {
  const response = await request.get(`${AUTH_URL}/v1/users/me`);
  return response.data.user;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch user';
      });
  },
});

export default userSlice.reducer;
