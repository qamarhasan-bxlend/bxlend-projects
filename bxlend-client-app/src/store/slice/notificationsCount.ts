import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';

interface NotificationState {
  notificationsCount: number;
  loading: boolean;
}

const initialState: NotificationState = {
  notificationsCount: 0,
  loading: false,
};

export const fetchNotificationsCount = createAsyncThunk(
  'notifications/fetchNotificationsCount',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/v1/notifications/total-count`);
      return response.data.total_count;
    } catch (err) {
      // @ts-expect-error TODO: Specify type
      if (!err.response) {
        throw err;
      }

      // @ts-expect-error TODO: Specify type
      dispatch(setAppAlert({ message: err.response.data.error ?? 'Something went wrong' }));
      // @ts-expect-error TODO: Specify type
      return rejectWithValue(err.response.data);
    }
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
      })
      .addCase(fetchNotificationsCount.fulfilled, (state, action) => {
        state.notificationsCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotificationsCount.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default notificationsSlice.reducer;
