import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { parse, stringify } from 'qs';
import { SyncOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Card, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { searchItems } from './Search/items';

import styles from './style.less';

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
        title: '创建时间',
        dataIndex: 'create_time',
        wdith: 100,
        render: val => val && val.substring(0, 10),
      },
      {
        width: 50,
        title: 'id',
        dataIndex: 'i',
      },
      {
        title: '操作',
        render: () => <a>详情</a>,
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
      type: 'adminLog/find',
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

  render() {
    const { loading } = this.props;
    const {
      selectedRows,
      data: { list, pagination },
    } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => (
        <span>
          <Button
            icon={<SyncOutlined />}
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
