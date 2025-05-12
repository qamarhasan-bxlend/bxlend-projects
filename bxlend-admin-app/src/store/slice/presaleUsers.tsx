import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { CONVERT_FIELD } from 'src/components/Table/helpers';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface PresaleState {
  data: {
    presaleUsers: object[];
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
    presaleUsers: [],
    totalCount: 0,
    totalPages: 0,
    field: 'ID',
    search: '',
  },
  loading: false,
  error: null,
};

export const fetchPresaleUsers = createAsyncThunk(
  'components/fetchPresaleUsers',
  async ({ page, field, search }: { page: number; field?: string; search?: string }) => {
    const response = await request.get(
      `${AUTH_URL}/presale/admin/presale-user?page=${page}&limit=10${
        search ? `&${CONVERT_FIELD(field || '')}=${search}` : ''
      }`
    );
    return {
      data: response.data.presale_user,
      totalCount: response.data.meta.total_count,
      totalPages: response.data.meta.page_count,
      page,
      field,
      search,
    };
  }
);

const kycData = createSlice({
  name: 'presale-users',
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
      .addCase(fetchPresaleUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresaleUsers.fulfilled, (state, action) => {
        state.data = {
          presaleUsers: action.payload.data,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
          field: action.payload.field ?? 'ID',
          search: action.payload.search ?? '',
        };
        state.loading = false;
      })
      .addCase(fetchPresaleUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch presale users';
      });
  },
});

export const { updateField, updateSearch } = kycData.actions;

export default kycData.reducer;
