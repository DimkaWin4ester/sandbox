import { Table } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';

export default function CurrencyRateTable() {
  const {
    loading,
    currencyForKeyList,
    currencyForKeyToKey,
    selectCurrencyTwo,
  } = useSelector((state: RootState) => state.currency);

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Курс',
      dataIndex: 'rate',
      key: 'rate',
    },
  ];

  type CurrencyRateRow = {
    key: string;
    date: string;
    rate: number | string;
  };

  let dataSource: CurrencyRateRow[] = [];
  if (selectCurrencyTwo && currencyForKeyToKey) {
    dataSource = Object.entries(currencyForKeyToKey).map(([date, rateMap]) => {
      const pairKey = Object.keys(rateMap)[0];
      return {
        key: date,
        date,
        rate: rateMap[pairKey],
      };
    });
  } else if (currencyForKeyList) {
    dataSource = Object.entries(currencyForKeyList).map(([key, value]) => ({
      key,
      date: key,
      rate: value,
    }));
  }

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={false}
      style={{ marginTop: 24 }}
    />
  );
}
