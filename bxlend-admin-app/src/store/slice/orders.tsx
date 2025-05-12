import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { CONVERT_FIELD } from 'src/components/Table/helpers';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface OrdersState {
  data: {
    orders: object[];
    totalCount: number;
    totalPages: number;
    field: string;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  data: {
    orders: [],
    totalCount: 0,
    totalPages: 0,
    field: 'ID',
    search: '',
  },
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'components/fetchOrders',
  async ({ page, search, field }: { page: number; field?: string; search?: string }) => {
    const response = await request.get(
      `${AUTH_URL}/v1/admin/orders?page=${page}&limit=10${
        search ? `&field=${CONVERT_FIELD(field || '')}&value=${search}` : ''
      }`
    );
    return {
      data: response.data.orders,
      totalCount: response.data.meta.total_count,
      totalPages: response.data.meta.page_count,
      page,
      field,
      search,
    };
  }
);

const ordersData = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field } = action.payload;
      console.log({ fielddd: field });
      state.data.field = field;
    },
    updateSearch: (state, action) => {
      const { search } = action.payload;
      state.data.search = search;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.data = {
          orders: action.payload.data,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
          field: action.payload.field ?? 'ID',
          search: action.payload.search ?? '',
        };
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch orders';
      });
  },
});

export const { updateField, updateSearch } = ordersData.actions;

export default ordersData.reducer;
