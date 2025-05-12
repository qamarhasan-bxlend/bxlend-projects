import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CONVERT_FIELD, TYPES_LIST, dataTypes, extractRequiredFields } from 'src/components/Table/helpers';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';
import { BANK_ACCOUNTS_HEADERS } from 'src/utils/constants';

interface EntitiesState {
  entities: object;
  loading: boolean;
  error: string | null;
}

const initialState: EntitiesState = {
  entities: {
    users: { data: null, totalCount: 0, page: 1, search: '', field: 'Name' },
    orders: { data: null, totalCount: 0, page: 1, search: '', field: 'ID' },
    transactions: { data: null, totalCount: 0, page: 1, search: '', field: 'ID' },
    waitingListUsers: { data: null, totalCount: 0, page: 1, search: '', field: 'Name' },
    bank_accounts: { data: null, totalCount: 0, page: 1, search: '', field: BANK_ACCOUNTS_HEADERS[0] },
    kyc: { data: null, totalCount: 0, page: 1, search: '', field: 'Name' },
    wallets: { data: null, totalCount: 0, page: 1, search: '', field: 'Address' },
  },
  loading: false,
  error: null,
};

export const fetchEntities = createAsyncThunk(
  'components/fetchEntities',
  async ({
    type,
    page,
    fields,
    field,
    search,
  }: {
    type: string;
    page: number;
    fields: string[];
    field?: string;
    search?: string;
  }) => {
    const response = await request.get(
      `${AUTH_URL}/v1/admin/${type}?page=${page}&limit=10${
        search ? `&field=${CONVERT_FIELD(field || '')}&value=${search}` : ''
      }`
    );
    return {
      // @ts-expect-error: Specify type
      type: dataTypes[type],
      data: extractRequiredFields(
        // @ts-expect-error: Specify type
        response.data[TYPES_LIST.includes(type) ? dataTypes[type] : response.data],
        fields
      ),
      totalCount: response.data.meta.total_count,
      totalPages: response.data.meta.page_count,
      page,
      field,
      search,
    };
  }
);

const dashboardData = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    updateEntityField: (state, action) => {
      const { entityType, field } = action.payload;
      // @ts-expect-error: Specify type
      state.entities[entityType].field = field;
    },
    updateEntitySearch: (state, action) => {
      const { entityType, search } = action.payload;
      // @ts-expect-error: Specify type
      state.entities[entityType].search = search;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        const { type, data, totalCount, totalPages, page, field, search = '' } = action.payload;
        // @ts-expect-error: Specify type
        state.entities[type].data = data;
        // @ts-expect-error: Specify type
        state.entities[type].totalCount = totalCount;
        // @ts-expect-error: Specify type
        state.entities[type].totalPages = totalPages;
        // @ts-expect-error: Specify type
        state.entities[type].page = page;
        // @ts-expect-error: Specify type
        state.entities[type].search = search;
        // @ts-expect-error: Specify type
        state.entities[type].field = field;
        state.loading = false;
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch entities';
      });
  },
});

export const { updateEntityField, updateEntitySearch } = dashboardData.actions;

export default dashboardData.reducer;
