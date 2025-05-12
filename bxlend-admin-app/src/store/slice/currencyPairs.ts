import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface CurrencyPairs {
  pairs: [];
  loading: boolean;
  error: string | null;
}

const initialState: CurrencyPairs = {
  pairs: [],
  loading: false,
  error: null,
};

export const fetchCurrencyPairs = createAsyncThunk(
  'notifications/fetchCurrencyPairs',
  async () => {
    const response = await request.get(`${AUTH_URL}/v1/currency-pairs`);
    return response.data.pairs;
  },
);

const currencyPairsSlice = createSlice({
  name: 'pairs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyPairs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyPairs.fulfilled, (state, action) => {
        state.pairs = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrencyPairs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch pairs';
      });
  },
});

export default currencyPairsSlice.reducer;
