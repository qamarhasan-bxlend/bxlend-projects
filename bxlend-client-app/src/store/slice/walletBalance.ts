import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isWalletBalanceVisible: true,
};

const walletBalanceSlice = createSlice({
  name: 'dashboardBalance',
  initialState,
  reducers: {
    setIsWalletBalanceVisible: (state) => {
      state.isWalletBalanceVisible = !state.isWalletBalanceVisible;
    },
  },
});

export const { setIsWalletBalanceVisible } = walletBalanceSlice.actions;
export default walletBalanceSlice.reducer;
