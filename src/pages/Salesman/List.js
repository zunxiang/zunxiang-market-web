import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { parse, stringify } from 'qs';
import {
  Table,
  Card,
  Form,
  Icon,
  Avatar,
  Dropdown,
  Menu,
  message,
  Select,
  Badge,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { searchItems } from './Search/items';

import styles from './style.less';

const { Option } = Select;

const status = {
  1: '正常',
  0: '禁用',
};
const statusMap = {
  1: 'success',
  0: 'error',
};
const refer = {
  APPLET: '小程序',
  SUB: '公众号',
};

const levels = ['一级', '二级', '三级', '四级', '五级'];

@connect(({ franchiser, loading }) => ({
  franchiser,
  loading: loading.models.franchiser,
}))
@Form.create()
class SalesmanList extends PureComponent {
  constructor(props) {
    super(props);
    const {
      location: { search },
    } = props;
    this.state = {
      currentPage: 1,
      pageSize: 10,
      formValues: {},
      filters: {},
      sorter: undefined,
      query: parse(search, { ignoreQueryPrefix: true }),
      data: {
        sum: {},
        list: [],
        pagination: {},
      },
    };

    this.columns = [
      {
        title: '头像',
        dataIndex: 'logo',
        wdith: 100,
        render: val => <Avatar src={val} size="small" />,
      },
      {
        width: 50,
        title: 'id',
        dataIndex: 'i',
      },
      {
        title: '昵称',
        width: 100,
        dataIndex: 'nickname',
      },
      {
        title: '来源',
        dataIndex: 'app_type',
        render: val => refer[val],
      },
      {
        title: '姓名',
        width: 100,
        dataIndex: 'real_name',
      },
      {
        title: '手机',
        width: 100,
        dataIndex: 'mobile',
      },
      {
        title: '账户余额',
        dataIndex: 'balance',
        sorter: true,
      },
      {
        title: '邀请人id',
        sorter: true,
        dataIndex: 'upper_i',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
      },
      {
        title: '分销等级',
        dataIndex: 'level',
        sorter: true,
        render: (val, record) => (
          <Select
            size="small"
            defaultValue={val}
            style={{ width: 100 }}
            onChange={l => this.handleChangeLevel(l, record.i)}
          >
            {levels.map((level, index) => (
              <Option value={index + 1} key={level}>
                {level}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: val => <Badge status={statusMap[val]} text={status[val]} />,
      },
      {
        title: '操作',
        render: (val, record) => (
          <Dropdown overlay={this.renderMenu(record)} placement="bottomCenter">
            <a className="ant-dropdown-link">
              更多操作
              <Icon type="down" />
            </a>
          </Dropdown>
        ),
      },
    ];
  }

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
      sum: ['balance'],
      ...query,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'franchiser/platfind',
      payload: params,
      callback: data => {
        this.setState({
          data,
        });
      },
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

  handleChangeLevel = (level, i) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'franchiser/changeLevel',
      payload: {
        level,
        i,
      },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleOfflineWithdraw = record => {
    if (record.balance === 0) {
      Modal.error({
        title: '提示信息',
        content: '该分销余额已经为0了',
        okText: '确认',
      });
    } else {
      Modal.confirm({
        title: '确认信息',
        content: '确认将该分销的账户余额清零吗？',
        okType: 'danger',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          const { dispatch } = this.props;
          dispatch({
            type: 'franchiser/offlineWithdraw',
            payload: {
              salesman_i: record.i,
            },
            callback: () => {
              message.success('操作成功');
              this.loadData();
            },
          });
        },
      });
    }
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
        handler: '/v1/mp/user/salesman',
        message: JSON.stringify(params),
      };
      window.open(`http://${location.host}/csv?${stringify(msg)}`);
    });
  };

  renderMenu = record => (
    <Menu>
      <Menu.Item>
        {record.state === 1 ? (
          <a onClick={() => this.handleChangeState('close', record)}>禁用账号</a>
        ) : (
          <a onClick={() => this.handleChangeState('open', record)}>解禁账号</a>
        )}
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleOfflineWithdraw(record)}>清空账户余额</a>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={{
            pathname: '/salesman/withdraw',
            search: `account_i=${record.i}`,
          }}
        >
          账单明细
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={{
            pathname: '/order/list',
            search: `salesman_i=${record.i}`,
          }}
        >
          查看订单
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

  render() {
    const { loading } = this.props;
    const {
      selectedRows,
      data: {
        list,
        pagination,
        sum: { balance },
      },
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.handlePaginationChange,
      onShowSizeChange: this.handlePageSizeChange,
      showTotal: total => (
        <span>
          <span style={{ marginRight: 16 }}>
            <span>总余额 </span>
            <span style={{ color: '#1890ff' }}>{balance / 100}</span>
          </span>
          <span>
            <span>共 </span>
            <span style={{ color: '#1890ff' }}>{total}</span>
            <span> 条数据</span>
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
              scroll={{ x: 1200 }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default SalesmanList;
