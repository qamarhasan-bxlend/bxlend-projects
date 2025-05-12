import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { CONVERT_FIELD } from 'src/components/Table/helpers';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface KycState {
  data: {
    kyc: object[];
    totalCount: number;
    totalPages: number;
    field: string;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: KycState = {
  data: {
    kyc: [],
    totalCount: 0,
    totalPages: 0,
    field: 'Name',
    search: '',
  },
  loading: false,
  error: null,
};

export const fetchKyc = createAsyncThunk(
  'components/fetchKyc',
  async ({ page, field, search }: { page: number; field?: string; search?: string }) => {
    const response = await request.get(
      `${AUTH_URL}/v1/admin/kyc?page=${page}&limit=10${
        search ? `&field=${CONVERT_FIELD(field || '')}&value=${search}` : ''
      }`
    );
    return {
      data: response.data.kyc,
      totalCount: response.data.meta.total_count,
      totalPages: response.data.meta.page_count,
      page,
      field,
      search,
    };
  }
);

const kycData = createSlice({
  name: 'kyc',
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
      .addCase(fetchKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKyc.fulfilled, (state, action) => {
        state.data = {
          kyc: action.payload.data,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
          field: action.payload.field ?? 'Name',
          search: action.payload.search ?? '',
        };
        state.loading = false;
      })
      .addCase(fetchKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch kyc';
      });
  },
});

export const { updateField, updateSearch } = kycData.actions;

export default kycData.reducer;
