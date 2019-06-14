import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { parse, stringify } from 'qs';
import QRCode from 'qrcode-react';
import { Card, Form, Button, Menu, message, Popconfirm, Modal, Dropdown, Icon } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProductList from './NormalList';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { normalSearchItems } from './Search/normal';

import styles from './style.less';

@connect(({ normal, loading }) => ({
  normal,
  loading: loading.models.normal,
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
      pageSize: 20,
      formValues: {},
      modalVisible: false,
      qrcodeSrc: undefined,
      qrcodeTitle: undefined,
      modalTitle: undefined,
      query: parse(search, { ignoreQueryPrefix: true }),
      data: {
        list: [],
        pagination: {},
        sum: {},
      },
    };
  }

  componentDidMount() {
    this.loadData();
    this.loadSmsTemp('HOTEL');
    this.loadSmsTemp('PKG');
    this.loadSmsTemp('GROUP');
    this.loadSmsTemp('RUSH');
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
      'type@in': ['PKG', 'GROUP', 'HOTEL', 'INT_PKG', 'INT_GROUP', 'INT_HOTEL'],
    };
    dispatch({
      type: 'normal/find',
      payload: params,
      callback: ({ list, pagination, sum }) => {
        this.setState({
          data: {
            list: [...list],
            pagination: { ...pagination },
            sum: { ...sum },
          },
        });
      },
    });
  };

  loadSmsTemp = type => {
    const { dispatch } = this.props;
    dispatch({
      type: 'normal/getSmsTemp',
      payload: { item_type: type },
    });
  };

  handleClose = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'normal/close',
      payload: { i },
      callback: () => {
        message.success('操作成功');
        this.loadData();
      },
    });
  };

  handleOpen = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'normal/open',
      payload: { i },
      callback: () => {
        this.loadData();
        message.success('操作成功');
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handlePreview = record => {
    this.setState({
      modalVisible: true,
      modalTitle: '产品预览',
      qrcodeTitle: record.name,
      qrcodeSrc: `http://${location.host}/m/item_details.html?i=${record.i}&preview=true`,
    });
  };

  handleEdit = (model, itemClass, type, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'normal/editNormal',
      payload: {
        record,
        itemClass,
        query: {
          model,
          type,
        },
      },
    });
  };

  handleWechatPush = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'normal/wechatPush',
      payload: {
        i,
      },
      callback: () => {
        message.success('推送成功');
      },
    });
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
      handler: '/v2/admin/item/main',
      message: JSON.stringify(params),
    };
    window.open(`http://${location.host}/csv?${stringify(msg)}`);
  };

  renderMenu = record => (
    <Menu>
      <Menu.Item>
        <Link
          to={{
            pathname: '/product/normal/detail',
            search: `i=${record.i}`,
          }}
        >
          产品详情
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Popconfirm
          title="确认给所有分销推送该商品吗?"
          onConfirm={() => this.handleWechatPush(record.i)}
          okText="确认"
          cancelText="取消"
        >
          <a>微信推送</a>
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={{
            pathname: '/log',
            search: `item_i=${record.i}&info=常规产品${record.i}`,
          }}
        >
          操作日志
        </Link>
      </Menu.Item>
    </Menu>
  );

  renderOperate = record => [
    record.state === 1 ? (
      <Popconfirm
        title="确认下架该产品?"
        onConfirm={() => this.handleClose(record.i)}
        okText="确认"
        cancelText="取消"
      >
        <a style={{ color: '#f5222d' }}>下架</a>
      </Popconfirm>
    ) : (
      <Popconfirm
        title="确认上架架该产品?"
        onConfirm={() => this.handleOpen(record.i)}
        okText="确认"
        cancelText="取消"
      >
        <a style={{ color: '#5b8c00' }}>上架</a>
      </Popconfirm>
    ),
    <Link
      to={{
        pathname: '/order/list',
        search: `item_i=${record.i}`,
      }}
    >
      查看订单
    </Link>,
    <Dropdown overlay={this.renderMenu(record)} placement="bottomCenter">
      <a className="ant-dropdown-link">
        更多
        <Icon type="down" />
      </a>
    </Dropdown>,
  ];

  renderCreateMenu = () => (
    <Menu>
      <Menu.Item>
        <a onClick={() => this.handleEdit('add', 'HOTEL', {})}>酒店</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleEdit('add', 'PKG', {})}>自由行</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleEdit('add', 'GROUP', {})}>跟团游</a>
      </Menu.Item>
    </Menu>
  );

  render() {
    const { loading } = this.props;
    const {
      query,
      data: { list, pagination },
      modalTitle,
      modalVisible,
      qrcodeSrc,
      qrcodeTitle,
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
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
              items={normalSearchItems}
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
            <ProductList
              onEdit={this.handleEdit}
              loading={loading}
              pagination={paginationProps}
              dataSource={['', ...list]}
              actions={this.renderOperate}
            />
          </div>
        </Card>
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
          destroyOnClose
          footer={null}
        >
          <div style={{ textAlign: 'center' }}>
            <div>{qrcodeTitle}</div>
            <div style={{ margin: '10px' }}>
              <a href={qrcodeSrc}>{qrcodeSrc}</a>
            </div>
            <div style={{ display: 'inline-block', marginLeft: 'auto', marginRight: 'auto' }}>
              <QRCode value={qrcodeSrc} />
            </div>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
