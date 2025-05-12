import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';
import { ICountry } from 'src/interfaces';

interface CountriesState {
  countries: ICountry[];
  loading: boolean;
}

const initialState: CountriesState = {
  countries: [],
  loading: false,
};

export const fetchCountries = createAsyncThunk(
  'notifications/fetchCountries',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/v1/countries?page=1&limit=250`);
      return response.data.countries;
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

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
        state.loading = false;
      })
      .addCase(fetchCountries.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default countriesSlice.reducer;
