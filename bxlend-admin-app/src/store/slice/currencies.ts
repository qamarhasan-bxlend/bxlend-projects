import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface CurrenciesState {
  currencies: [];
  loading: boolean;
  error: string | null;
}

const initialState: CurrenciesState = {
  currencies: [],
  loading: false,
  error: null,
};

export const fetchCurrencies = createAsyncThunk('notifications/fetchCurrencies', async () => {
  const response = await request.get(`${AUTH_URL}/v1/currencies`);
  return response.data.currencies;
});

const currenciesSlice = createSlice({
  name: 'currencies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.currencies = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch currencies';
      });
  },
});

export default currenciesSlice.reducer;
