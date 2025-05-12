import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { CONVERT_FIELD } from 'src/components/Table/helpers';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface WaitingListState {
  data: {
    waitingListUsers: object[];
    totalCount: number;
    totalPages: number;
    field: string;
    search: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: WaitingListState = {
  data: {
    waitingListUsers: [],
    totalCount: 0,
    totalPages: 0,
    field: 'Name',
    search: '',
  },
  loading: false,
  error: null,
};

export const fetchWaitingListUsers = createAsyncThunk(
  'components/fetchWaitingListUsers',
  async ({ page, search, field }: { page: number; search?: string; field?: string }) => {
    const response = await request.get(
      `${AUTH_URL}/v1/admin/waiting-list-users?page=${page}&limit=10${
        search ? `&field=${CONVERT_FIELD(field || '')}&value=${search}` : ''
      }`
    );
    return {
      data: response.data.waitingListUsers,
      totalCount: response.data.meta.total_count,
      totalPages: response.data.meta.page_count,
      page,
      field,
      search,
    };
  }
);

const waitingListUsers = createSlice({
  name: 'waiting-list-users',
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
      .addCase(fetchWaitingListUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWaitingListUsers.fulfilled, (state, action) => {
        state.data = {
          waitingListUsers: action.payload.data,
          totalCount: action.payload.totalCount,
          totalPages: action.payload.totalPages,
          field: action.payload.field ?? 'Name',
          search: action.payload.search ?? '',
        };
        state.loading = false;
      })
      .addCase(fetchWaitingListUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch waiting list users';
      });
  },
});

export const { updateField, updateSearch } = waitingListUsers.actions;

export default waitingListUsers.reducer;
