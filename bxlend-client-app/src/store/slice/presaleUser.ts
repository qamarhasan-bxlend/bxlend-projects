import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';
import { IPresaleUser } from 'src/interfaces';

interface PresaleUserState {
  presaleUser: IPresaleUser | null;
  loading: boolean;
}

const initialState: PresaleUserState = {
  presaleUser: null,
  loading: false,
};

export const fetchPresaleUser = createAsyncThunk(
  'notifications/fetchPresaleUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/presale/client/presale-user`);
      return response.data.presale_user;
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

const presaleUserSlice = createSlice({
  name: 'presale-user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresaleUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPresaleUser.fulfilled, (state, action) => {
        state.presaleUser = action.payload;
        state.loading = false;
      })
      .addCase(fetchPresaleUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default presaleUserSlice.reducer;
