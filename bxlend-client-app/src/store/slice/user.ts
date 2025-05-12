import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';
import { IUser } from 'src/interfaces';

interface UserState {
  user: IUser;
  loading: boolean;
}

const initialState: UserState = {
  user: {
    id: '',
    email: '',
    email_verified: false,
    name: {
      first: '',
      last: '',
    },
    birthdate: '',
    phone_number: {},
    phone_number_verified: false,
    kyc_status: '',
    favorite_currencyPairs: [],
    status: '',
    created_at: '',
    updated_at: '',
    twoFA_verified: false,
    bxlend_id: '',
    referred_by: null,
  },
  loading: false,
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/v1/users/me`);
      return response.data.user;
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
