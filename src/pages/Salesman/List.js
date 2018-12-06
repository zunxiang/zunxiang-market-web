import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { parse, stringify } from 'qs';
import {
  Table,
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Avatar,
  Dropdown,
  Menu,
  message,
  Select,
  Badge,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { searchItems } from './Search/items';

import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const status = {
  1: '正常',
  0: '禁用',
};
const statusMap = {
  1: 'success',
  0: 'error',
};

const statusOptions = [];
for (const key in status) {
  if (status[key]) {
    statusOptions.push(
      <Option value={key} key={key}>
        {status[key]}
      </Option>
    );
  }
}

const bonus = {
  1: '正常',
  0: '禁用',
};

const bonusMap = {
  1: 'success',
  0: 'error',
};

const bonusOptions = [];
for (const key in bonus) {
  if (status[key]) {
    bonusOptions.push(
      <Option value={key} key={key}>
        {status[key]}
      </Option>
    );
  }
}

@connect(({ franchiser, loading }) => ({
  franchiser,
  loading: loading.models.franchiser,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    expandForm: false,
    formValues: {},
    filters: {},
    sorter: undefined,
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { dispatch } = this.props;
    const { formValues, filters, pageSize, currentPage, sorter, query } = this.state;
    const params = {
      currentPage,
      pageSize,
      order: sorter,
      ...query,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'franchiser/platfind',
      payload: params,
    });
  };

  handlePaginationChange = (page, pageSize) => {
    this.setState(
      {
        currentPage: page,
        pageSize,
      },
      this.loadData
    );
  };

  handlePageSizeChange = (current, size) => {
    this.setState(
      {
        currentPage: 1,
        pageSize: size,
      },
      this.loadData
    );
  };

  handleSearch = values => {
    this.setState(
      {
        formValues: values,
        currentPage: 1,
      },
      this.loadData
    );
  };

  handleChangeState = (type, { i }) => {
    const { dispatch } = this.props;
    dispatch({
      type: `franchiser/palt${type}`,
      payload: { i },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleChangeAward = (type, { i }) => {
    const { dispatch } = this.props;
    dispatch({
      type: `franchiser/palt${type}`,
      payload: { i },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleExport = () => {
    const { filters, sorter, query } = this.state;
    this.searchForm.getFormValue(values => {
      const params = {
        order: sorter,
        ...query,
        ...values,
        ...filters,
      };
      const msg = {
        handler: '/v2/admin/salesman/main',
        message: JSON.stringify(params),
      };
      window.open(`http://${location.host}/csv?${stringify(msg)}`);
    });
  };

  columns = [
    {
      title: '头像',
      dataIndex: 'logo',
      render: val => {
        return <Avatar src={val} size="small" />;
      },
    },
    {
      title: 'id',
      dataIndex: 'i',
    },
    {
      title: '姓名',
      dataIndex: 'bankman',
    },
    {
      title: '手机',
      dataIndex: 'mobile',
    },
    {
      title: '店铺名',
      dataIndex: 'shopname',
    },
    {
      title: '账户余额',
      dataIndex: 'balance',
      sorter: true,
      render: val => val / 100,
    },
    {
      title: '当月业绩',
      dataIndex: 'achievement',
      sorter: true,
      render: val => val / 100,
    },
    {
      title: '邀请人id',
      dataIndex: 'inviter_i',
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: val => val.substring(0, 10),
    },
    {
      title: '邀请奖励',
      dataIndex: 'is_open_bonus',
      render: val => {
        return <Badge status={bonusMap[val]} text={bonus[val]} />;
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      render: val => {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (val, record) => {
        return (
          <Dropdown overlay={this.renderMenu(record)} placement="bottomCenter">
            <a className="ant-dropdown-link">
              更多操作
              <Icon type="down" />
            </a>
          </Dropdown>
        );
      },
    },
  ];

  renderMenu = record => {
    return (
      <Menu>
        <Menu.Item>
          {record.state === 1 ? (
            <a onClick={() => this.handleChangeState('close', record)}>禁用账号</a>
          ) : (
            <a onClick={() => this.handleChangeState('open', record)}>解禁账号</a>
          )}
        </Menu.Item>
        <Menu.Item>
          {record.is_open_bonus === 1 ? (
            <a onClick={() => this.handleChangeAward('closeBonus', record)}>禁止奖励</a>
          ) : (
            <a onClick={() => this.handleChangeAward('allowBonus', record)}>启用奖励</a>
          )}
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/finance/bills',
              search: `account_i=${record.i}&account_type=SALESMAN`,
            }}
          >
            账单明细
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/normal/orders',
              search: `salesman_i=${record.i}`,
            }}
          >
            常规订单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/presale/orders',
              search: `salesman_i=${record.i}`,
            }}
          >
            预售订单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/log',
              search: `salesman_i=${record.i}&info=分销商${record.i}`,
            }}
          >
            操作日志
          </Link>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const {
      franchiser: {
        data: { list, pagination, sum },
      },
      loading,
    } = this.props;
    const { selectedRows } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => (
        <span>
          <Button
            icon="sync"
            shape="circle"
            size="small"
            type="dashed"
            onClick={this.loadData}
            style={{ marginRight: 8 }}
            title="刷新"
            loading={loading}
          />
          <span>
            共 <span style={{ color: '#1890ff' }}>{total}</span> 条数据
          </span>
        </span>
      ),
      ...pagination,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
              items={searchItems}
              onSubmit={this.handleSearch}
              onReset={this.handleFormReset}
              onMounted={self => {
                this.searchForm = self;
              }}
              onRefresh={this.loadData}
            />
            <Table
              selectedRows={selectedRows}
              rowKey={record => record.i}
              loading={loading}
              dataSource={list}
              pagination={paginationProps}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
