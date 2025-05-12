import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';
import { IPresaleInfo } from 'src/interfaces';

interface PresaleState {
  presale: IPresaleInfo | null;
  loading: boolean;
}

const initialState: PresaleState = {
  presale: null,
  loading: false,
};

export const fetchPresale = createAsyncThunk(
  'notifications/fetchPresale',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/presale/client/presale-info`);
      return response.data.token_setups[0];
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

const presaleSlice = createSlice({
  name: 'presale',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresale.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPresale.fulfilled, (state, action) => {
        state.presale = action.payload;
        state.loading = false;
      })
      .addCase(fetchPresale.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default presaleSlice.reducer;
