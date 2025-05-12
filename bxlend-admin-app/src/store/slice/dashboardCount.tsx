import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface DashboardDataState {
  data: Record<string, number>;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardDataState = {
  data: {},
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (type: string) => {
    const response = await request.get(`${AUTH_URL}/v1/admin/dashboard/${type}`);
    return { type, count: type === 'transactions' ? response.data.transaction_count.length : response.data.total_count };
  }
);

const dashboardData = createSlice({
  name: 'dashboardData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        const { type, count } = action.payload;
        if (type === 'bank-accounts') {
            state.data.bankAccounts = count
        } else {
            state.data[type] = count;
        }
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch data';
      });
  },
});

export default dashboardData.reducer;
