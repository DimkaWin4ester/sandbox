import { Button, Flex, Select, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  fetchCurrencyForKey,
  fetchCurrencyForKeyToKey,
  setSelectCurrency,
  setSelectCurrencyTwo,
  setSelectedPeriod,
  setCustomDateRange,
  resetCurrencyState,
  fetchCurrency,
} from 'src/store/currencySlice';
import { AppDispatch, RootState } from 'src/store/store';

export default function CurrencyRateTop({
  tab,
  setTab,
}: {
  tab: 'table' | 'chart';
  setTab: (val: 'table' | 'chart') => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    currencyList,
    loading,
    selectCurrency,
    selectCurrencyTwo,
    selectedPeriod,
    startDate,
    endDate,
  } = useSelector((state: RootState) => state.currency);

  const options = currencyList
    ? Object.entries(currencyList).map(([code, name]) => ({
        label: `${code} - ${name}`,
        value: code,
      }))
    : [];

  const options2 = currencyList
    ? Object.entries(currencyList)
        .filter(([code]) => code !== selectCurrency)
        .map(([code, name]) => ({
          label: `${code} - ${name}`,
          value: code,
        }))
    : [];

  const handleSelectChange = (value: string) => {
    dispatch(setSelectCurrency(value));
    dispatch(fetchCurrencyForKey({ currency_key: value }));
  };
  const handleSelectChangeTwo = (value: string) => {
    dispatch(setSelectCurrencyTwo(value));
    dispatch(fetchCurrencyForKeyToKey());
  };
  const handleRefreshClick = () => {
    if (selectCurrencyTwo) {
      dispatch(fetchCurrencyForKeyToKey());
    } else if (selectCurrency) {
      dispatch(fetchCurrencyForKey({ currency_key: selectCurrency }));
    }
  };

  const periods: {
    label: string;
    value: '1d' | '3d' | '7d' | '30d' | 'custom';
  }[] = [
    { label: '1 день', value: '1d' },
    { label: '3 дня', value: '3d' },
    { label: 'Неделя', value: '7d' },
    { label: 'Месяц', value: '30d' },
    { label: 'Выбрать даты', value: 'custom' },
  ];

  const onPeriodClick = async (
    period: '1d' | '3d' | '7d' | '30d' | 'custom'
  ) => {
    dispatch(setSelectedPeriod(period));
    await dispatch(fetchCurrencyForKeyToKey());
  };

  const onCustomDateChange = async (dates: (dayjs.Dayjs | null)[] | null) => {
    if (dates && dates[0] && dates[1]) {
      const start = dates[0].format('YYYY-MM-DD');
      const end = dates[1].format('YYYY-MM-DD');
      dispatch(setCustomDateRange({ startDate: start, endDate: end }));
      await dispatch(fetchCurrencyForKeyToKey());
    }
  };

  const handleClear = () => {
    dispatch(resetCurrencyState());
    dispatch(fetchCurrency());
  };

  return (
    <Flex gap="small" vertical>
      <Flex gap="small">
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Выберите валюту"
          optionFilterProp="label"
          options={options}
          onChange={handleSelectChange}
          loading={loading}
          filterOption={(input, option) =>
            (option?.label as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={selectCurrency}
        />
        <Button
          type="default"
          onClick={handleRefreshClick}
          disabled={!selectCurrency || loading}
        >
          Обновить
        </Button>
        <Button type="dashed" onClick={handleClear} disabled={loading}>
          Очистить
        </Button>
      </Flex>

      <Flex gap="small">
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="Выберите валюту"
          optionFilterProp="label"
          options={options2}
          onChange={handleSelectChangeTwo}
          loading={loading}
          filterOption={(input, option) =>
            (option?.label as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          value={selectCurrencyTwo}
        />
      </Flex>

      {selectCurrencyTwo && (
        <>
          <Flex gap="small" wrap="wrap" align="center">
            {periods.map(({ label, value }) => (
              <Button
                key={value}
                type={selectedPeriod === value ? 'primary' : 'default'}
                onClick={() => onPeriodClick(value)}
                disabled={loading}
              >
                {label}
              </Button>
            ))}

            {selectedPeriod === 'custom' && (
              <DatePicker.RangePicker
                disabled={loading}
                value={
                  selectedPeriod === 'custom' && startDate && endDate
                    ? [dayjs(startDate), dayjs(endDate)]
                    : undefined
                }
                onChange={onCustomDateChange}
                allowClear={false}
                allowEmpty={[true, true]}
                style={{ minWidth: 250 }}
                disabledDate={(current) =>
                  current && current > dayjs().endOf('day')
                }
              />
            )}
          </Flex>
        </>
      )}

      <Flex gap="small">
        <Button
          type={tab === 'table' ? 'primary' : 'default'}
          onClick={() => setTab('table')}
          disabled={loading}
        >
          Таблица
        </Button>
        <Button
          type={tab === 'chart' ? 'primary' : 'default'}
          onClick={() => setTab('chart')}
          disabled={loading}
        >
          Диаграмма
        </Button>
      </Flex>
    </Flex>
  );
}
