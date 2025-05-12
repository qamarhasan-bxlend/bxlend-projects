import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface WalletAddressesState {
  walletAddresses: [];
  walletsCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: WalletAddressesState = {
  walletAddresses: [],
  walletsCount: 0,
  loading: false,
  error: null,
};

export const fetchWalletAddresses = createAsyncThunk(
  'notifications/fetchWalletAddresses',
  async () => {
    const response = await request.get(`${AUTH_URL}/v1/wallet_addresses`);
    return { walletAddresses: response.data.wallets, walletsCount: response.data.meta.total_count };
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
        state.error = null;
      })
      .addCase(fetchWalletAddresses.fulfilled, (state, action) => {
        state.walletAddresses = action.payload.walletAddresses;
        state.walletsCount = action.payload.walletsCount;
        state.loading = false;
      })
      .addCase(fetchWalletAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch wallet addresses';
      });
  },
});

export default walletAddressesSlice.reducer;
