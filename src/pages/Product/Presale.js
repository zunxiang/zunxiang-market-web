import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { parse, stringify } from 'qs';
import QRCode from 'qrcode-react';
import {
  Card,
  Form,
  Icon,
  Button,
  Dropdown,
  Modal,
  Menu,
  Divider,
  Popconfirm,
  message,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ProductList from './PresaleList';
import SearchForm from '@/components/FormGenerator/SearchForm';
import { preasleSearchItems } from './Search/presale';

import styles from './style.less';

@connect(({ presale, loading }) => ({
  presale,
  loading: loading.models.presale,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    filters: {},
    currentPage: 1,
    pageSize: 10,
    formValues: {},
    sorter: 'sort:+',
    modalVisible: false,
    qrcodeSrc: undefined,
    qrcodeTitle: undefined,
    modalTitle: undefined,
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
      type: 'presale/find',
      payload: params,
    });
  };

  handleClose = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'presale/close',
      payload: { i },
      callback: () => {
        this.loadData();
      },
    });
  };

  handleOpen = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'presale/open',
      payload: { i },
      callback: () => {
        this.loadData();
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
      qrcodeTitle: record.title,
      qrcodeSrc: `http://${location.host}/m/presale_details.html?i=${record.i}&preview=true`,
    });
  };

  handleBookByEcodeUrl = record => {
    this.setState({
      modalVisible: true,
      modalTitle: '电子码预约网址',
      qrcodeTitle: record.title,
      qrcodeSrc: `http://${location.host}/m/use_by_ecode.html?i=${record.i}`,
    });
  };

  handleBookByPhoneUrl = record => {
    this.setState({
      modalVisible: true,
      modalTitle: '手机号预约网址',
      qrcodeTitle: record.title,
      qrcodeSrc: `http://${location.host}/m/ecode_book.html?i=${record.i}`,
    });
  };

  handleEdit = (type, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'presale/editPresale',
      payload: { type, record },
    });
  };

  handleWechatPush = i => {
    const { dispatch } = this.props;
    dispatch({
      type: 'presale/wechatPush',
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
      handler: '/v2/admin/item/rush',
      message: JSON.stringify(params),
    };
    window.open(`http://${location.host}/csv?${stringify(msg)}`);
  };

  renderOperate = record => {
    if (record.state !== 'CLOSE') {
      return (
        <div>
          <Popconfirm
            title="确认下架该产品?"
            onConfirm={() => {
              this.handleClose(record.i);
            }}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: '#f5222d' }}>下架</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Dropdown overlay={this.renderMenu(record)} placement="bottomCenter">
            <a className="ant-dropdown-link">
              更多操作<Icon type="down" />
            </a>
          </Dropdown>
        </div>
      );
    } else {
      return (
        <div>
          <Popconfirm
            title="确认上架架该产品?"
            onConfirm={() => {
              this.handleOpen(record.i);
            }}
            okText="确认"
            cancelText="取消"
          >
            <a style={{ color: '#5b8c00' }}>上架</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Dropdown overlay={this.renderMenu(record)}>
            <a className="ant-dropdown-link">
              更多操作<Icon type="down" />
            </a>
          </Dropdown>
        </div>
      );
    }
  };

  renderMenu = record => {
    return (
      <Menu>
        <Menu.Item>
          <Popconfirm
            title="确认给所有管家推送该商品吗?"
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
              pathname: '/presale/detail',
              search: `i=${record.i}`,
            }}
          >
            产品详情
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/presale/diff-commission',
              search: `rush_i=${record.i}`,
            }}
          >
            差异佣金
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/presale/orders',
              search: `rush_i=${record.i}`,
            }}
          >
            查看订单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/presale/books',
              search: `rush_i=${record.i}`,
            }}
          >
            预约订单
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/poster',
              search: `presale_i=${record.i}&type=presale`,
            }}
          >
            产品海报
          </Link>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.handlePreview(record)}>产品预览</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.handleBookByPhoneUrl(record)}>无码预约网址</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => this.handleBookByEcodeUrl(record)}>有码预约网址</a>
        </Menu.Item>
        <Menu.Item>
          <Link
            to={{
              pathname: '/log',
              search: `rush_i=${record.i}&info=预售产品${record.i}`,
            }}
          >
            操作日志
          </Link>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { presale: { data: { list, pagination } }, loading } = this.props;
    const { query } = this.state;
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
      <PageHeaderWrapper title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <SearchForm
              items={preasleSearchItems}
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
                  <Link to="/presale/sort">
                    <Button style={{ marginLeft: 8 }} ghost type="primary">
                      排序
                    </Button>
                  </Link>
                </Fragment>
              }
            />
            <ProductList
              bordered
              itemLayout="vertical"
              size="middle"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              operates={this.renderOperate}
            />
          </div>
        </Card>
        <Modal
          title={this.state.modalTitle}
          visible={this.state.modalVisible}
          onOk={() => this.handleModalVisible(false)}
          onCancel={() => this.handleModalVisible(false)}
          destroyOnClose
          footer={null}
        >
          <div style={{ textAlign: 'center' }}>
            <div>{this.state.qrcodeTitle}</div>
            <div style={{ margin: '10px' }}>
              <a href={this.state.qrcodeSrc}>{this.state.qrcodeSrc}</a>
            </div>
            <div style={{ display: 'inline-block', marginLeft: 'auto', marginRight: 'auto' }}>
              <QRCode value={this.state.qrcodeSrc} />
            </div>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
