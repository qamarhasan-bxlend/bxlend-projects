import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface NotificationState {
  notificationsCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notificationsCount: 0,
  loading: false,
  error: null,
};

export const fetchNotificationsCount = createAsyncThunk<number>(
  'notifications/fetchNotificationsCount',
  async () => {
    const response = await request.get(`${AUTH_URL}/v1/notifications/total-count`);
    return response.data.total_count;
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsCount.fulfilled, (state, action) => {
        state.notificationsCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotificationsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch notifications count';
      });
  },
});

export default notificationsSlice.reducer;
