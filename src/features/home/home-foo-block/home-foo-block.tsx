import { useState } from 'react';
import { Button, Flex, Grid, Modal } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { recursiveSortCode } from '@utils/recursiveSort';
import { recursiveForEachCode } from '@utils/recursiveForEach';
import { recursiveFindCode } from '@utils/recursiveFind';

const initialDates = [
  '04.03.2024 10:00 (GMT +3)',
  '04.04.2024 10:00 (GMT +3)',
  '17.06.2023 13:00 (GMT +3)',
  '18.07.2023 13:00 (GMT +7)',
  '23.07.2021 23:50 (GMT +1)',
  '24.07.2021 00:45 (GMT +3)',
  '04.08.2024 10:00 (GMT +3)',
  '06.04.2024 03:00 (GMT +4)',
];

export default function HomeFooBlock() {
  const [dates, setDates] = useState(initialDates);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const parseDateWithTimezone = (dateString: string) => {
    const timezoneMatch = dateString.match(/\(GMT ([+\-]\d+)\)/);
    const timezoneOffset = timezoneMatch ? parseInt(timezoneMatch[1], 10) : 0;

    const dateWithoutTimezone = dateString.replace(/\(GMT [^\)]+\)/, '').trim();
    const [day, month, year, hour, minute] =
      dateWithoutTimezone.split(/[\s.:]/);

    const date = new Date(`${month}/${day}/${year} ${hour}:${minute}`);
    const timeZoneOffsetInMinutes = timezoneOffset * 60;

    date.setMinutes(date.getMinutes() + timeZoneOffsetInMinutes);

    return date;
  };

  const sortDates = (direction: 'asc' | 'desc') => {
    const sorted = [...dates].sort((a, b) => {
      const dateA = parseDateWithTimezone(a);
      const dateB = parseDateWithTimezone(b);

      return direction === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
    setDates(sorted);
    setSortDirection(direction);
  };

  return (
    <Flex
      gap={'small'}
      vertical={screens.xs ? true : false}
    >
      <Flex
        gap={'small'}
        align={'start'}
        vertical
        style={{ minWidth: '200px' }}
      >
        {dates.map((date, index) => (
          <div key={index}>{date}</div>
        ))}
      </Flex>

      <Flex gap={'small'} align={'start'} vertical>
        <Button
          type={sortDirection === 'asc' ? 'primary' : 'default'}
          icon={<ArrowUpOutlined style={{ fontSize: '16px' }} />}
          style={{ width: '50px' }}
          onClick={() => sortDates('asc')}
        />
        <Button
          type={sortDirection === 'desc' ? 'primary' : 'default'}
          icon={<ArrowDownOutlined style={{ fontSize: '16px' }} />}
          style={{ width: '50px' }}
          onClick={() => sortDates('desc')}
        />
        <Button type="dashed" onClick={() => setIsModalOpen(true)}>
          Посмотреть функции
        </Button>
      </Flex>

      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        okText="Ок"
        cancelText="Закрыть"
        width={800}
      >
        <div
          style={{
            maxHeight: '600px',
            overflowY: 'auto',
            marginTop: '30px',
          }}
        >
          <pre>
            <strong>Поиск</strong>
            <br />
            {recursiveFindCode}
          </pre>
          <pre>
            <strong>Перебор</strong>
            <br />
            {recursiveForEachCode}
          </pre>
          <pre>
            <strong>Сортировка</strong>
            <br />
            {recursiveSortCode}
          </pre>
        </div>
      </Modal>
    </Flex>
  );
}
