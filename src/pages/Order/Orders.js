import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { parse, stringify } from 'qs';
import { Card, Form, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OrderList from './AllList';
import SearchForm from '../../customComponents/FormGenerator/SearchForm';
import { orderSearchItems } from './Search/all';

import styles from './Orders.less';

@connect(({ order, user, loading }) => ({
  order,
  user,
  loading: loading.models.order,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    filters: {},
    currentPage: 1,
    pageSize: 10,
    formValues: {},
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
    data: {
      list: [],
      sum: {},
      pagination: {},
    },
  };

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    const {
      order: { freshtime },
    } = nextProps;
    if (freshtime !== this.props.order.freshtime) {
      this.loadData();
    }
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
      type: 'order/find',
      payload: params,
      callback: data => {
        this.setState({
          data,
        });
      },
    });
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
      handler: '/v3/admin/order',
      message: JSON.stringify(params),
    };
    window.open(`http://${location.host}/csv?${stringify(msg)}`);
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
      <PageHeaderLayout>
        <Card>
          <div className={styles.tableList}>
            <SearchForm
              items={orderSearchItems}
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
            <OrderList
              bordered
              itemLayout="vertical"
              size="middle"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
