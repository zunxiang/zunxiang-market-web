import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { parse, stringify } from 'qs';
import { Table, Card, Button, Badge, Popconfirm } from 'antd';
import PageHeaderLayout from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { searchItems } from './Search/items';

import styles from './List.less';

const statusMap = ['error', 'success'];
const status = ['禁用', '正常'];

@connect(({ adminWemall, loading }) => ({
  adminWemall,
  loading: loading.models.adminWemall,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filters: {},
      currentPage: 1,
      pageSize: 10,
      formValues: {},
      query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
      data: {
        list: [],
        pagination: {},
      },
    };
    this.columns = [
      {
        title: 'id',
        dataIndex: 'i',
        width: 50,
      },
      {
        title: '商城id',
        dataIndex: 'app_i',
        width: 100,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        width: 100,
      },
      {
        title: '联系人',
        dataIndex: 'name',
        width: 100,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        width: 150,
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 80,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '创建时间',
        wdith: 120,
        dataIndex: 'create_time',
        render: val => val && val.substring(0, 10),
      },
      {
        title: '最后登录',
        wdith: 120,
        dataIndex: 'last_login',
        render: val => val && val.substring(0, 19),
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
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
      type: 'adminWemall/findAccount',
      payload: params,
      callback: data => {
        this.setState({
          data: { ...data },
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

  handleSearch = values => {
    this.setState(
      {
        formValues: values,
        currentPage: 1,
      },
      this.loadData
    );
  };

  handleExport = () => {
    const { formValues, filters, sorter, query } = this.state;
    const params = {
      order: sorter,
      ...query,
      ...formValues,
      ...filters,
    };
    const msg = {
      handler: '/v2/admin/app/app',
      message: JSON.stringify(params),
    };
    window.open(`http://${location.host}/csv?${stringify(msg)}`);
  };

  render() {
    const { loading } = this.props;
    const {
      selectedRows,
      query,
      data: { list, pagination },
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => (
        <span>
          共 <span style={{ color: '#1890ff' }}>{total}</span> 条数据
        </span>
      ),
      ...pagination,
    };
    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
              items={searchItems}
              values={{ ...query }}
              onSubmit={this.handleSearch}
              onMounted={self => {
                this.searchForm = self;
              }}
              onRefresh={this.loadData}
              extra={
                <Button
                  style={{ marginLeft: 8 }}
                  icon="download"
                  ghost
                  type="primary"
                  onClick={this.handleExport}
                >
                  导出
                </Button>
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
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
