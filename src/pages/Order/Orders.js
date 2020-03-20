import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { parse, stringify } from 'qs';
import { Card, Form, Button, Descriptions } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import OrderList from './AllList';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { orderSearchItems } from './Search/all';

import styles from './Orders.less';

@connect(({ order, user, loading }) => ({
  order,
  user,
  loading: loading.models.order,
}))
@Form.create()
export default class TableList extends PureComponent {
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
        sum: {},
        pagination: {},
      },
    };
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
      sum: ['amount', 'total_fee', 'size'],
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
    const { filters, sorter, query } = this.state;
    this.searchForm.getFormValue(values => {
      const params = {
        order: sorter,
        query: [
          {
            ...query,
            ...values,
            ...filters,
          },
        ],
      };
      const msg = {
        handler: '/v1/mp/order/mp_order',
        message: JSON.stringify(params),
      };
      window.open(`http://${location.host}/csv?${stringify(msg)}`);
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

  renderCount = () => {
    const {
      data: { sum },
    } = this.state;
    return (
      <Descriptions size="small" column={6}>
        <Descriptions.Item label="总金额">
          <a>{sum.amount}</a>
        </Descriptions.Item>
        <Descriptions.Item label="总佣金">
          <a>{sum.totalFee}</a>
        </Descriptions.Item>
        <Descriptions.Item label="总份数">
          <a>{sum.size}</a>
        </Descriptions.Item>
      </Descriptions>
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
            <span>共</span>
            <span style={{ color: '#1890ff' }}>{total}</span>
            <span>条数据</span>
          </span>
        </span>
      ),
      ...pagination,
    };
    return (
      <PageHeaderWrapper>
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
            <div>{this.renderCount()}</div>
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
      </PageHeaderWrapper>
    );
  }
}
