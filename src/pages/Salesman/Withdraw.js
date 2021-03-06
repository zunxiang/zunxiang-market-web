import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { parse, stringify } from 'qs';
import { Card, Form, Table, Button, Divider, Popconfirm, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';

import styles from './style.less';

const status = {
  0: '待处理',
  1: '处理中',
  2: '已成功',
};
const searchItems = [
  {
    type: 'select',
    parse: 'default',
    key: 'state@in',
    label: '状态',
    selectOptions: status,
    selectMode: 'multiple',
  },
  {
    type: 'text',
    parse: 'default',
    key: 'account_i',
    label: '分销id',
  },
];
@connect(({ loading }) => ({
  loading: loading.models.withdraw,
}))
@Form.create()
export default class withdrawList extends PureComponent {
  constructor(props) {
    super(props);
    const {
      location: { search },
    } = props;
    this.state = {
      filters: {},
      currentPage: 1,
      pageSize: 10,
      formValues: {},
      query: parse(search, { ignoreQueryPrefix: true }),
      data: {
        list: [],
        pagination: {},
        sum: {},
      },
    };
    this.columns = [
      {
        title: '流水号',
        dataIndex: 'withdraw_no',
        sorter: true,
      },
      {
        title: '账户ID',
        dataIndex: 'account_i',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: val => val && val.substring(0, 19),
      },
      {
        title: '提现金额',
        dataIndex: 'amount',
        render: val => val / 100,
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: val => status[val],
      },
      {
        title: '操作',
        key: 'op',
        render: (val, record) => (
          <Fragment>
            {record.state === 1 ? (
              <Fragment>
                <Popconfirm
                  title="确认该笔提现完成?"
                  onConfirm={() => this.handleFinish(record.i)}
                  okText="确认"
                  cancelText="取消"
                >
                  <a>提现成功</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="确认该笔提现失败?"
                  onConfirm={() => this.handleError(record.i)}
                  okText="确认"
                  cancelText="取消"
                >
                  <a>提现失败</a>
                </Popconfirm>
              </Fragment>
            ) : null}
          </Fragment>
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
      ...query,
      ...formValues,
      ...filters,
    };
    dispatch({
      type: 'withdraw/find',
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
      this.loadData
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

  handleExport = i => {
    const msg = {
      handler: '/v2/admin/bill/withdraw',
      message: JSON.stringify({ i }),
    };
    window.open(`http://${location.host}/csv?${stringify(msg)}`);
  };

  handleFinish = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'withdraw/finish',
      payload: { i },
      callback: () => {
        this.loadData();
        message.success('操作成功');
      },
    });
  };

  handleError = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'withdraw/error',
      payload: { i },
      callback: () => {
        this.loadData();
        message.success('操作成功');
      },
    });
  };

  ShowTotal = total => {
    const { loading } = this.props;
    return (
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
    );
  };

  render() {
    const { loading } = this.props;
    const {
      data: { list, pagination },
      query,
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.handlePaginationChange,
      onShowSizeChange: this.handlePageSizeChange,
      showTotal: this.ShowTotal,
      ...pagination,
    };

    return (
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
              items={searchItems}
              values={{ ...query }}
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
              rowKey={record => record.i}
              loading={loading}
              dataSource={list}
              pagination={paginationProps}
              columns={this.columns}
              onChange={this.handleTableChange}
              scroll={{ x: 1000 }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
