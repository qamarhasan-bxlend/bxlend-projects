import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';

interface IUserReferralState {
  myReferrals:
    | [
        {
          name: string;
          bxlend_id: string;
        },
      ]
    | null;
  referred_by: null | string;
  loading: boolean;
}

const initialState: IUserReferralState = {
  myReferrals: null,
  referred_by: null,
  loading: false,
};

export const fetchUserReferral = createAsyncThunk(
  'user/fetchUserReferral',
  async ({ userId }: { userId: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/v1/users/${userId}/referral`);
      return response.data.myReferrals;
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

const userReferralSlice = createSlice({
  name: 'userReferrals',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReferral.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserReferral.fulfilled, (state, action) => {
        state.myReferrals = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserReferral.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userReferralSlice.reducer;
