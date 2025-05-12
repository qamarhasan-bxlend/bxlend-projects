import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { CONVERT_FIELD } from 'src/components/Table/helpers';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface BankAccountsState {
  data: {
    bankAccounts: object[];
    totalCount: number;
    totalPages: number;
    field: string;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: BankAccountsState = {
  data: {
    bankAccounts: [],
    totalCount: 0,
    totalPages: 0,
    field: 'ID',
    search: '',
  },
  loading: false,
  error: null,
};

export const fetchBankAccounts = createAsyncThunk(
  'components/fetchBankAccounts',
  async ({ page, search, field }: { page: number; search?: string; field?: string }) => {
    const response = await request.get(
      `${AUTH_URL}/v1/admin/bank-accounts?page=${page}&limit=10${
        search ? `&field=${CONVERT_FIELD(field || '')}&value=${search}` : ''
      }`
    );
    return {
      data: response.data.bank_accounts,
      totalCount: response.data.meta.total_count,
      totalPages: response.data.meta.page_count,
      page,
      field,
      search,
    };
  }
);

const bankAccountsData = createSlice({
  name: 'bank-accounts',
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
      .addCase(fetchBankAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBankAccounts.fulfilled, (state, action) => {
        state.data = {
          bankAccounts: action.payload.data,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
          field: action.payload.field ?? 'ID',
          search: action.payload.search ?? '',
        };
        state.loading = false;
      })
      .addCase(fetchBankAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch bank accounts';
      });
  },
});

export const { updateField, updateSearch } = bankAccountsData.actions;

export default bankAccountsData.reducer;
