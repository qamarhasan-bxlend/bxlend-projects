import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface PresaleToken {
  presaleToken: object[];
  loading: boolean;
  error: string | null;
}

const initialState: PresaleToken = {
  presaleToken: [],
  loading: false,
  error: null,
};

export const fetchPresaleToken = createAsyncThunk('components/fetchPresaleToken', async () => {
  const response = await request.get(`${AUTH_URL}/presale/admin/presale-info`);
  return response.data.token_setups[0];
});

const dashboardData = createSlice({
  name: 'presale-token',
  initialState,
  reducers: {
    updateEntityField: (state, action) => {
      const { entityType, field } = action.payload;
      // @ts-expect-error: Specify type
      state.presaleToken[entityType].field = field;
    },
    updateEntitySearch: (state, action) => {
      const { entityType, search } = action.payload;
      // @ts-expect-error: Specify type
      state.presaleToken[entityType].search = search;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresaleToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresaleToken.fulfilled, (state, action) => {
        state.presaleToken = action.payload;
        state.loading = false;
      })
      .addCase(fetchPresaleToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch presale token';
      });
  },
});

export const { updateEntityField, updateEntitySearch } = dashboardData.actions;

export default dashboardData.reducer;
