import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { CONVERT_FIELD } from 'src/components/Table/helpers';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface WalletsState {
  data: {
    wallets: object[];
    totalCount: number;
    totalPages: number;
    field: string;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: WalletsState = {
  data: {
    wallets: [],
    totalCount: 0,
    totalPages: 0,
    field: 'Wallet ID',
    search: '',
  },
  loading: false,
  error: null,
};

export const fetchWallets = createAsyncThunk(
  'components/fetchWallets',
  async ({ page, search, field }: { page: number; search?: string; field?: string }) => {
    const response = await request.get(
      `${AUTH_URL}/v1/admin/wallets?page=${page}&limit=10${
        search ? `&field=${CONVERT_FIELD(field || '')}&value=${search}` : ''
      }`
    );
    return {
      data: response.data.wallets,
      totalCount: response.data.meta.total_count,
      totalPages: response.data.meta.page_count,
      page,
      field,
      search,
    };
  }
);

const walletsData = createSlice({
  name: 'wallets',
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
      .addCase(fetchWallets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWallets.fulfilled, (state, action) => {
        state.data = {
          wallets: action.payload.data,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
          field: action.payload.field ?? 'Wallet ID',
          search: action.payload.search ?? '',
        };
        state.loading = false;
      })
      .addCase(fetchWallets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch wallets';
      });
  },
});

export const { updateField, updateSearch } = walletsData.actions;

export default walletsData.reducer;
