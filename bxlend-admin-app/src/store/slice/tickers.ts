import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface TickersState {
  tickers: [];
  loading: boolean;
  error: string | null;
}

const initialState: TickersState = {
  tickers: [],
  loading: false,
  error: null,
};

export const fetchTickers = createAsyncThunk('notifications/fetchTickers', async () => {
  const response = await request.get(`${AUTH_URL}/v1/tickers`);
  return response.data;
});

const tickersSlice = createSlice({
  name: 'tickers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickers.fulfilled, (state, action) => {
        state.tickers = action.payload;
        state.loading = false;
      })
      .addCase(fetchTickers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch tickers';
      });
  },
});

export default tickersSlice.reducer;
