import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PUBLIC_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';

interface WalletAddressesState {
  walletAddresses: [];
  walletsCount: number;
  loading: boolean;
}

const initialState: WalletAddressesState = {
  walletAddresses: [],
  walletsCount: 0,
  loading: false,
};

export const fetchWalletAddresses = createAsyncThunk(
  'notifications/fetchWalletAddresses',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await request.get(`${PUBLIC_URL}/v1/wallet_addresses`);
      return {
        walletAddresses: response.data.wallets,
        walletsCount: response.data.meta.total_count,
      };
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

const walletAddressesSlice = createSlice({
  name: 'walletAddresses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWalletAddresses.fulfilled, (state, action) => {
        state.walletAddresses = action.payload.walletAddresses;
        state.walletsCount = action.payload.walletsCount;
        state.loading = false;
      })
      .addCase(fetchWalletAddresses.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default walletAddressesSlice.reducer;
