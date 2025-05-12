import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_URL } from 'src/configs';
import request from 'src/request';
import { setAppAlert } from './appAlert';

interface OrdersState {
  orders: object;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: {
    OPEN_ORDER: {
      data: null,
      dataInitial: null,
      totalCount: null,
      totalPages: null,
      page: 1,
      filterType: '',
      filterPair: '',
    },
    ORDER_HISTORY: {
      data: null,
      dataInitial: null,
      totalCount: null,
      totalPages: null,
      page: 1,
      filterType: '',
      filterPair: '',
    },
    TRADE_HISTORY: {
      data: null,
      dataInitial: null,
      totalCount: null,
      totalPages: null,
      page: 1,
      filterType: '',
      filterPair: '',
    },
  },
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'components/fetchOrders',
  async (
    {
      type,
      page,
      filterType = '',
      filterPair = '',
    }: {
      type: string;
      page: number;
      filterType?: string;
      filterPair?: string;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await request.get(
        `${AUTH_URL}/v1/orders?page=${page}&limit=10&order_type=${type}${filterType}${filterPair}`,
      );
      return {
        type,
        data: response.data.orders,
        dataInitial: response.data.orders,
        totalCount: response.data.meta.total_count,
        totalPages: response.data.meta.page_count,
        page,
      };
    } catch (err) {
      // @ts-expect-error TODO: Specify type
      if (!err.response) {
        throw err;
      }

      // @ts-expect-error TODO: Specify type
      dispatch(setAppAlert({ message: err.response.data.error ?? 'Something went wrong' }));

      // @ts-expect-error TODO: Specify type
      return rejectWithValue(err.response.data);
    }
  },
);

const orders = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateFilterType: (state, action) => {
      const { orderType, filterType } = action.payload;
      state.orders[orderType].filterType = filterType;
    },
    updateFilterPair: (state, action) => {
      const { orderType, filterPair } = action.payload;
      state.orders[orderType].filterPair = filterPair;
    },
    filterOrdersBySearch: (state, action) => {
      const { orderType, orders } = action.payload;
      state.orders[orderType].data = orders;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        const { type, data, totalCount, totalPages, page } = action.payload;
        state.orders[type].data = data;
        state.orders[type].dataInitial = data;
        state.orders[type].totalCount = totalCount;
        state.orders[type].totalPages = totalPages;
        state.orders[type].page = page;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        // @ts-expect-error TODO: Specify type
        state.error = action.payload.error ?? 'Failed to fetch orders';
      });
  },
});

export const { updateFilterType, updateFilterPair, filterOrdersBySearch } = orders.actions;

export default orders.reducer;
