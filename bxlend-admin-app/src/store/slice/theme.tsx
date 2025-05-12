import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  const storedTheme = localStorage.getItem('theme');
  return {
    isDark: storedTheme ? JSON.parse(storedTheme).isDark : false,
  };
};

const themeSlice = createSlice({
  name: 'isDark',
  initialState: getInitialState(),
  reducers: {
    setTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', JSON.stringify({ isDark: state.isDark }));
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
