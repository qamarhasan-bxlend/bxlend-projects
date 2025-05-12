import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';

interface CurrencyPairs {
  pairs: [];
  loading: boolean;
}

const initialState: CurrencyPairs = {
  pairs: [],
  loading: false,
};

export const fetchCurrencyPairs = createAsyncThunk(
  'notifications/fetchCurrencyPairs',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/v1/currency-pairs`);
      return response.data.pairs;
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

const currencyPairsSlice = createSlice({
  name: 'pairs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyPairs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrencyPairs.fulfilled, (state, action) => {
        state.pairs = action.payload;
      })
      .addCase(fetchCurrencyPairs.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default currencyPairsSlice.reducer;
