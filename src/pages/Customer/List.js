import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Button, Avatar, Badge, Popconfirm, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Prompt from '@/components/Prompt';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { searchItems } from './Search/items';

import styles from './List.less';

const statusMap = ['error', 'success'];
const status = ['禁用', '正常'];
const refer = {
  APPLET: '小程序',
  SUB: '公众号',
};

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    currentPage: 1,
    pageSize: 10,
    formValues: {},
    filters: {},
    sorter: undefined,
    showCouponModal: false,
    currentCustomer: null,
    data: {
      list: [],
      sum: {},
      pagination: {},
    },
  };

  columns = [
    {
      title: '头像',
      dataIndex: 'logo',
      render: val => <Avatar src={val} size="small" />,
    },
    {
      title: 'id',
      dataIndex: 'i',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '来源',
      dataIndex: 'app_type',
      render: val => refer[val],
    },
    {
      title: '积分',
      dataIndex: 'score',
    },
    {
      title: '经验值',
      dataIndex: 'exp',
      render: val => val / 100,
    },
    {
      title: '注册时间',
      dataIndex: 'create_time',
      render: val => val.substring(0, 10),
    },
    {
      title: '状态',
      dataIndex: 'state',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '最后登录',
      dataIndex: 'last_login',
      render: val => val && val.substring(0, 19),
    },
    {
      title: '操作',
      render: (val, record) => (
        <Fragment>
          {record.state === 1 ? (
            <Popconfirm
              title="确认禁用该账号?"
              onConfirm={() => this.handleClose(record.i)}
              okText="确认"
              cancelText="取消"
            >
              <a style={{ color: '#f5222d' }} href="#">
                禁用
              </a>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="确认启用该账号?"
              onConfirm={() => this.handleOpen(record.i)}
              okText="确认"
              cancelText="取消"
            >
              <a style={{ color: '#5b8c00' }}>启用</a>
            </Popconfirm>
          )}
          {/* <Divider type="vertical" />
            <a onClick={() => this.handleShowGiveCouponModal(record)}>发优惠券</a> */}
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const { dispatch } = this.props;
    const { formValues, filters, pageSize, currentPage, sorter } = this.state;
    const params = {
      currentPage,
      pageSize,
      order: sorter,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'customer/find',
      payload: params,
      callback: data => {
        this.setState({
          data,
        });
      },
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = filtersArg[key].length > 0 ? ['in', filtersArg[key]] : undefined;
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}:${sorter.order === 'ascend' ? '+' : '-'}`;
    }
    this.setState(
      {
        ...params,
      },
      () => {
        this.loadData();
      }
    );
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

  handleChangeSalesman = (value, i) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/changeSalesman',
      payload: {
        i,
        salesman_i: value,
      },
      callback: () => {
        message.success('修改成功');
      },
    });
  };

  handleOpen = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/open',
      payload: { i },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleClose = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/close',
      payload: { i },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleGiveCoupon = values => {
    const { dispatch } = this.props;
    const {
      currentCustomer: { i },
    } = this.state;
    dispatch({
      type: 'customer/giveCoupon',
      payload: { ...values, account_i: i },
      callback: () => {
        this.loadData();
        message.success('操作成功');
      },
    });
  };

  handleGiveCouponCancel = () => {
    this.setState({
      showCouponModal: false,
      currentCustomer: null,
    });
  };

  handleShowGiveCouponModal = record => {
    this.setState({
      showCouponModal: true,
      currentCustomer: record,
    });
  };

  render() {
    const { loading } = this.props;
    const {
      selectedRows,
      showCouponModal,
      data: { list, pagination },
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => (
        <span>
          <span>共</span>
          <span style={{ color: '#1890ff' }}>{total}</span>
          <span>条数据</span>
        </span>
      ),
      ...pagination,
    };

    return (
      <PageHeaderWrapper title="">
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
              extra={
                <Fragment>
                  <Button
                    style={{ marginLeft: 8 }}
                    icon="download"
                    ghost
                    type="primary"
                    onClick={this.handleExport}
                  >
                    导出
                  </Button>
                </Fragment>
              }
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
        <Prompt
          title="发放优惠券"
          label="优惠券id"
          error="请输入优惠券id"
          name="code"
          onOk={this.handleGiveCoupon}
          onCancel={this.handleGiveCouponCancel}
          modalVisible={showCouponModal}
          type="input"
        />
      </PageHeaderWrapper>
    );
  }
}
