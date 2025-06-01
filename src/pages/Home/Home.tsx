import { Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './Home.module.css';
import HomeFooBlock from 'src/features/home/home-foo-block/home-foo-block';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate()
  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Функции',
      children: <HomeFooBlock />,
    },
    {
      key: '2',
      label: 'Конвертер',
      children: 'Content of Tab Pane 2',
    },
    {
      key: '3',
      label: 'Таблица',
      children: 'Content of Tab Pane 3',
    },
  ];
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Button type='primary' onClick={()=>navigate('/currency-rate')}>К валютам</Button>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
