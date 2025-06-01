import { useEffect, useState } from 'react';
import styles from './CurrencyRate.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrency } from 'src/store/currencySlice';
import { AppDispatch, RootState } from 'src/store/store';
import CurrencyRateTop from './CurrencyRateTop/CurrencyRateTop';
import CurrencyRateTable from './CurrencyRateTable/CurrencyRateTable';
import CurrencyBarChart from './CurrencyBarChart/CurrencyBarChart';
import { Flex } from 'antd';

export default function CurrencyRate() {
  const dispatch = useDispatch<AppDispatch>();
  const { currencyForKeyList } = useSelector(
    (state: RootState) => state.currency
  );
  const [tab, setTab] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    dispatch(fetchCurrency());
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <Flex gap={'small'} style={{ width: '100%' }} vertical>
        <CurrencyRateTop tab={tab} setTab={setTab} />
        {currencyForKeyList && tab === 'table' && <CurrencyRateTable />}
        {currencyForKeyList && tab === 'chart' && <CurrencyBarChart />}
      </Flex>
    </div>
  );
}
