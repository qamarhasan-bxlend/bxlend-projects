import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';
import { ITicker } from 'src/interfaces';

interface TickersState {
  tickers: ITicker[];
  loading: boolean;
}

const initialState: TickersState = {
  tickers: [],
  loading: false,
};

export const fetchTickers = createAsyncThunk<ITicker[], void>(
  'notifications/fetchTickers',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/v1/tickers`);
      return response.data;
    } catch (err) {
      // @ts-expect-error TODO: Specify type
      if (!err.response) {
        throw err; // Throw non-response errors
      }
      // @ts-expect-error TODO: Specify type
      dispatch(setAppAlert({ message: err.response.data.error ?? 'Something went wrong' }));
      // @ts-expect-error TODO: Specify type
      return rejectWithValue(err.response.data);
    }
  },
);

const tickersSlice = createSlice({
  name: 'tickers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickers.fulfilled, (state, action) => {
        state.tickers = action.payload;
        state.loading = false;
      })
      .addCase(fetchTickers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default tickersSlice.reducer;
