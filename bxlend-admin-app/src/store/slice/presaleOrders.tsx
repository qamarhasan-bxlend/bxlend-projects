import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { CONVERT_FIELD } from 'src/components/Table/helpers';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface PresaleState {
  data: {
    presaleOrders: object[];
    totalCount: number;
    totalPages: number;
    field: string;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: PresaleState = {
  data: {
    presaleOrders: [],
    totalCount: 0,
    totalPages: 0,
    field: 'Order No',
    search: '',
  },
  loading: false,
  error: null,
};

export const fetchPresaleOrders = createAsyncThunk(
  'components/fetchPresaleOrders',
  async ({ page, field, search }: { page: number; field?: string; search?: string }) => {
    const response = await request.get(
      `${AUTH_URL}/presale/admin/presale-transaction?page=${page}&limit=10${
        search ? `&${CONVERT_FIELD(field || '')}=${search}` : ''
      }`
    );
    return {
      data: response.data.presale_transactions,
      totalCount: response.data.meta.total_count,
      totalPages: response.data.meta.page_count,
      field,
      search,
    };
  }
);

const presaleOrders = createSlice({
  name: 'presale-orders',
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { field } = action.payload;
      state.data.field = field;
    },
    updateSearch: (state, action) => {
      const { search } = action.payload;
      state.data.search = search;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresaleOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresaleOrders.fulfilled, (state, action) => {
        state.data = {
          presaleOrders: action.payload.data,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
          field: action.payload.field ?? 'Order No',
          search: action.payload.search ?? '',
        };
        state.loading = false;
      })
      .addCase(fetchPresaleOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch presale transactions';
      });
  },
});

export const { updateField, updateSearch } = presaleOrders.actions;

export default presaleOrders.reducer;
