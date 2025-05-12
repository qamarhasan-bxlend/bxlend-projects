import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';
import { ICurrency } from 'src/interfaces';

interface CurrenciesState {
  currencies: ICurrency[];
  loading: boolean;
}

const initialState: CurrenciesState = {
  currencies: [],
  loading: false,
};

export const fetchCurrencies = createAsyncThunk(
  'notifications/fetchCurrencies',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/v1/currencies`);
      return response.data.currencies;
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

const currenciesSlice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.currencies = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrencies.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default currenciesSlice.reducer;
