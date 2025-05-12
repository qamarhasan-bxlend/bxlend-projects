// NotificationCountSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface appAlert {
  message: string;
  isSuccess?: boolean;
}

const initialState: appAlert = {
  message: '',
  isSuccess: false,
};

const appAlertSlice = createSlice({
  name: 'appAlert',
  initialState,
  reducers: {
    setAppAlert(state, action) {
      state.message = action.payload.message || '';
      state.isSuccess = action.payload.isSuccess ?? false;
    },
  },
});

export const { setAppAlert } = appAlertSlice.actions;

export default appAlertSlice.reducer;
