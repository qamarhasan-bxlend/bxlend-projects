import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';

interface SettingsState {
  settings: [];
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: [],
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk('notifications/fetchSettings', async () => {
  const response = await request.get(`${AUTH_URL}/v1/admin/settings/application-setting`);
  return response.data.settings;
});

const settings = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch settings';
      });
  },
});

export default settings.reducer;
