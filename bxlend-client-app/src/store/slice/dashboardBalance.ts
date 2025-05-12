import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDashboardBalanceVisible: true,
};

const dashboardBalanceSlice = createSlice({
  name: 'dashboardBalance',
  initialState,
  reducers: {
    setIsDashboardBalanceVisible: (state) => {
      state.isDashboardBalanceVisible = !state.isDashboardBalanceVisible;
    },
  },
});

export const { setIsDashboardBalanceVisible } = dashboardBalanceSlice.actions;
export default dashboardBalanceSlice.reducer;
