import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/store';
import { Flex } from 'antd';

export default function CurrencyBarChart() {
  const {
    currencyForKeyList,
    currencyForKeyToKey,
    selectCurrencyTwo,
  } = useSelector((state: RootState) => state.currency);

  let dataSource: { key: string; label: string; rate: number }[] = [];

  if (selectCurrencyTwo && currencyForKeyToKey && Object.keys(currencyForKeyToKey).length > 0) {

    dataSource = Object.entries(currencyForKeyToKey).map(([date, rateObj]) => ({
      key: date,
      label: date,
      rate: Object.values(rateObj)[0],
    }));
  } else if (currencyForKeyList) {

    dataSource = Object.entries(currencyForKeyList).map(([key, value]) => ({
      key,
      label: key.slice(3),
      rate: Number(value),
    }));
  }

  return (
    <Flex gap="small" vertical>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={dataSource}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="rate" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </Flex>
  );
}
