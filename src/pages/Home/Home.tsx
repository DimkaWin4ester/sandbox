import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import styles from './Home.module.css';
import HomeFooBlock from '../../features/home/home-foo-block/home-foo-block';

export default function HomePage() {
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
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
}
