import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface DepositCountState {
  depositCount: null | number;
  loading: boolean;
  error: string | null;
}

const initialState: DepositCountState = {
  depositCount: null,
  loading: false,
  error: null,
};

export const fetchDepositCount = createAsyncThunk('notifications/fetchDepositCount', async () => {
  const response = await request.get(`${AUTH_URL}/v1/admin/dashboard/transactions/deposit`);
  return response.data.total_count;
});

const depositCount = createSlice({
  name: 'depositCount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepositCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepositCount.fulfilled, (state, action) => {
        state.depositCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepositCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch deposit';
      });
  },
});

export default depositCount.reducer;
