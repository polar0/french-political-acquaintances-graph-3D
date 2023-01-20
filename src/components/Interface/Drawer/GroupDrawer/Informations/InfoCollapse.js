import { Collapse, Table } from 'antd';
import { numberToPeriod } from 'src/systems/utils';
import { useInterface } from 'src/stores';

const { Panel } = Collapse;

const InfoCollapse = ({ data }) => {
  const { setDrawer, closeDrawer } = useInterface();

  const columnsGeneral = [
    {
      key: 'type',
      title: '',
      dataIndex: 'type',
      render: (value, index) => (
        <span key={index} style={{ fontWeight: 600 }}>
          {value}
        </span>
      ),
    },
    {
      key: 'value',
      title: '',
      dataIndex: 'value',
    },
  ];

  const sortableKeys = [
    'age',
    'experience',
    'participationScore',
    'loyaltyScore',
    'majorityScore',
  ];

  const columnsMembers = Object.keys(data.members).map((key) => ({
    key,
    title: data.members[key].type,
    dataIndex: key,
    sorter: sortableKeys.includes(key)
      ? (a, b) => Number(a[key]) - Number(b[key])
      : false,
    render: (value, index) => {
      if (key === 'raw') return null;
      if (key === 'experience') return numberToPeriod(value);
      if (
        key === 'participationScore' ||
        key === 'loyaltyScore' ||
        key === 'majorityScore'
      ) {
        return `${value} %`;
      }
      if (key === 'image') {
        return (
          <img
            key={index}
            src={value}
            alt='member'
            style={{ width: 'auto', height: 100 }}
          />
        );
      }
      return value;
    },
    onCell: (record) => {
      return {
        onClick: () => {
          setDrawer(null, record.raw, 'individual');
        },
        colSpan: key === 'raw' ? 0 : 1,
      };
    },
    colSpan: key === 'raw' ? 0 : 1,
  }));

  const dataSource =
    data.members.length !== 0 &&
    data.members[Object.keys(data.members)[0]].value.map((_, index) => {
      return Object.keys(data.members).reduce((acc, key) => {
        acc[key] = data.members[key].value[index];
        return acc;
      }, {});
    });

  return (
    <Collapse accordion ghost>
      {/* General informations */}
      <Panel
        header={<span className='panel-header'>Informations générales</span>}
        key='1'
      >
        <Table
          dataSource={Object.values(data.general)}
          columns={columnsGeneral}
          pagination={false}
        />
      </Panel>

      {/* Members informations */}
      <Panel
        header={<span className='panel-header'>Membres du groupe</span>}
        key='2'
      >
        <Table dataSource={dataSource} columns={columnsMembers} />
      </Panel>
    </Collapse>
  );
};

export default InfoCollapse;