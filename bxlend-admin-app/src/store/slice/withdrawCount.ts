import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface WithdrawCountState {
  withdrawCount: null | number;
  loading: boolean;
  error: string | null;
}

const initialState: WithdrawCountState = {
  withdrawCount: null,
  loading: false,
  error: null,
};

export const fetchWithdrawCount = createAsyncThunk('notifications/fetchWithdrawCount', async () => {
  const response = await request.get(`${AUTH_URL}/v1/admin/dashboard/transactions/withdraw`);
  return response.data.total_count;
});

const withdrawCount = createSlice({
  name: 'withdrawCount',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawCount.fulfilled, (state, action) => {
        state.withdrawCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchWithdrawCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch withdraw';
      });
  },
});

export default withdrawCount.reducer;
