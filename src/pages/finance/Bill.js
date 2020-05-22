import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Card, InputNumber, Modal, Statistic, Button } from 'antd';
import QRCode from 'qrcode-react';
import currency from 'currency.js';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { searchItems } from './Search/items';

import styles from './style.less';

const FormItem = Form.Item;

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.bill,
}))
export default class TableList extends PureComponent {
  state = {
    filters: {},
    currentPage: 1,
    pageSize: 10,
    formValues: {},
    modalVisiable: false,
    data: {
      sum: {},
      list: [],
      pagination: {},
    },
    showQrcode: false,
    qrcodeData: '',
    chargeAmount: 0,
    balance: 0,
  };

  columns = [
    {
      title: '创建时间',
      dataIndex: 'create_time',
    },
    {
      title: '流水号',
      dataIndex: 'order_no',
    },
    {
      title: '描述',
      dataIndex: 'title',
    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
    {
      title: '账户余额',
      dataIndex: 'balance',
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
      type: 'bill/find',
      payload: params,
      callback: data => {
        this.setState({
          data,
        });
        this.handleGetBalance();
      },
    });
  };

  handleGetBalance = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bill/getBalance',
      payload: {},
      callback: data => {
        const { balance } = data;
        this.setState({
          balance: currency(balance).divide(100).value,
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

  handleModalVisiable = flag => {
    this.setState({
      modalVisiable: !!flag,
    });
  };

  handleQrcodeVisiable = flag => {
    this.setState({
      showQrcode: !!flag,
    });
    if (!flag) {
      this.handleGetBalance();
    }
  };

  handleChargeInputChange = value => {
    this.setState({
      chargeAmount: value,
    });
  };

  handleGetChargeQrcode = () => {
    this.handleModalVisiable(false);
    const { dispatch } = this.props;
    const { chargeAmount } = this.state;
    dispatch({
      type: 'bill/charge',
      payload: {
        amount: currency(chargeAmount).intValue,
      },
      callback: data => {
        this.setState({
          qrcodeData: data,
          showQrcode: true,
        });
      },
    });
  };

  render() {
    const { loading } = this.props;
    const {
      selectedRows,
      data: { list, pagination },
      modalVisiable,
      showQrcode,
      qrcodeData,
      balance,
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
    const extraContent = (
      <div className={styles.extraContent}>
        <Statistic title="账户余额(元)" value={balance} precision={2} />
        <Button
          className={styles.chargeBtn}
          type="primary"
          ghost
          size="small"
          onClick={() => this.handleModalVisiable(true)}
        >
          充值
        </Button>
      </div>
    );
    return (
      <PageHeaderWrapper content="账单记录" extraContent={extraContent}>
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
        <Modal
          title="充值信息"
          visible={modalVisiable}
          onCancel={() => this.handleModalVisiable(false)}
          onOk={this.handleGetChargeQrcode}
        >
          <FormItem label="充值金额" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
            <InputNumber
              style={{ width: 150 }}
              min={1}
              onChange={this.handleChargeInputChange}
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/￥\s?|(,*)/g, '')}
            />
          </FormItem>
        </Modal>
        <Modal
          title="充值账户充值"
          visible={showQrcode}
          onCancel={() => this.handleQrcodeVisiable(false)}
          footer={false}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <QRCode value={qrcodeData} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>请扫描上方二维码付款进行充值</div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
