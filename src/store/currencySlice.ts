import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from 'src/services/api';
import { endpointsList } from 'src/services/endpointsList';
import { notification } from 'antd';

type CurrencyForKeyToKey = {
  [date: string]: {
    [currencyPair: string]: number;
  };
};

type CurrencyForKeyToKeyResponse = {
  success: boolean;
  terms: string;
  privacy: string;
  timeframe: boolean;
  start_date: string;
  end_date: string;
  source: string;
  quotes: CurrencyForKeyToKey;
};

type CurrencyForKeyList = {
  [code: string]: string;
};

type CurrencyForKeyResponse = {
  success: true;
  terms: string;
  privacy: string;
  timestamp: number;
  source: string;
  quotes: CurrencyForKeyList;
};

type CurrencyList = {
  [code: string]: string;
};

type CurrencyListResponse = {
  success: boolean;
  terms: string;
  privacy: string;
  currencies: CurrencyList;
};

interface CurrencyState {
  loading: boolean;
  error: string | null;
  currencyList: CurrencyList | null;
  currencyForKeyList: CurrencyForKeyList | null;
  selectCurrency: string | null;
  selectCurrencyTwo: string | null;
  selectedPeriod: '1d' | '3d' | '7d' | '30d' | 'custom';
  startDate: string | null;
  endDate: string | null;
  currencyForKeyToKey: CurrencyForKeyToKey | null;
}

const initialState: CurrencyState = {
  loading: false,
  error: null,
  currencyList: null,
  currencyForKeyList: null,
  selectCurrency: null,
  selectCurrencyTwo: null,
  selectedPeriod: '1d',
  startDate: null,
  endDate: null,
  currencyForKeyToKey: null,
};

export const fetchCurrency = createAsyncThunk(
  'currency/fetchCurrency',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CurrencyListResponse>(
        endpointsList.currencyList
      );

      if (response?.data?.success) {
        return response.data.currencies;
      } else {
        throw new Error('Ошибка получения валют');
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

export const fetchCurrencyForKey = createAsyncThunk(
  'currency/fetchCurrencyForKey',
  async ({ currency_key }: { currency_key: string }, { rejectWithValue }) => {
    try {
      const response = await api.get<CurrencyForKeyResponse>(
        endpointsList.currencyRateForId,
        {
          params: {
            source: currency_key,
          },
        }
      );

      if (response?.data?.success) {
        return response.data.quotes;
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

export const fetchCurrencyForKeyToKey = createAsyncThunk(
  'currency/fetchCurrencyForKeyToKey',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { currency: CurrencyState };

      const today = new Date();
      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      let startDate = state.currency.startDate;
      let endDate = state.currency.endDate;

      if (state.currency.selectedPeriod !== 'custom') {
        const daysMap = {
          '1d': 1,
          '3d': 3,
          '7d': 7,
          '30d': 30,
        };

        const daysCount = daysMap[state.currency.selectedPeriod] || 7;
        endDate = formatDate(today);
        const start = new Date(today);
        start.setDate(today.getDate() - (daysCount - 1));
        startDate = formatDate(start);
      }

      if (!state.currency.selectCurrency || !state.currency.selectCurrencyTwo) {
        throw new Error('Выберите валюты для сравнения');
      }

      if (!startDate || !endDate) {
        return 'skip';
      }

      const response = await api.get<CurrencyForKeyToKeyResponse>(
        endpointsList.currencyTimeframe,
        {
          params: {
            source: state.currency.selectCurrency,
            currencies: state.currency.selectCurrencyTwo,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );

      if (response?.data?.success) {
        return response.data.quotes;
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setSelectCurrency(state, action) {
      state.selectCurrency = action.payload;
    },
    setSelectCurrencyTwo(state, action) {
      state.selectCurrencyTwo = action.payload;
    },
    setSelectedPeriod(
      state,
      action: PayloadAction<'1d' | '3d' | '7d' | '30d' | 'custom'>
    ) {
      state.selectedPeriod = action.payload;
      if (action.payload !== 'custom') {
        state.startDate = null;
        state.endDate = null;
      }
    },
    setCustomDateRange(
      state,
      action: PayloadAction<{ startDate: string; endDate: string }>
    ) {
      state.selectedPeriod = 'custom';
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    resetCurrencyState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyList = action.payload;
      })
      .addCase(fetchCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Unknown error';
      })

      .addCase(fetchCurrencyForKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyForKey.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyForKeyList = action.payload ?? null;
      })
      .addCase(fetchCurrencyForKey.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Unknown error';
      })

      .addCase(fetchCurrencyForKeyToKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyForKeyToKey.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyForKeyToKey =
          action.payload === 'skip'
            ? state.currencyForKeyToKey
            : action.payload ?? null;
      })
      .addCase(fetchCurrencyForKeyToKey.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Unknown error';
      });
  },
});

export const {
  clearError,
  setSelectCurrency,
  setSelectCurrencyTwo,
  setSelectedPeriod,
  setCustomDateRange,
  resetCurrencyState,
} = currencySlice.actions;
export default currencySlice.reducer;
