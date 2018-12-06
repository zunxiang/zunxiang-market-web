import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Menu, Dropdown, Icon, Button, message, Modal, Table, Badge, Popconfirm } from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
import DescriptionList from '@/components/DescriptionList';
import Debounce from 'lodash-decorators/debounce';
import Ellipsis from '@/components/Ellipsis/index';
import QRCode from 'qrcode-react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PackageList from './NormalPackageList';
import { insuranceStatus, insuranceStatusMap } from './common';

const { Description } = DescriptionList;

const textures = {
  HOTEL: '酒店',
  PKG: '自由行',
  GROUP: '跟团游',
};
const status = {
  0: '已下架',
  1: '出售中',
  2: '已售罄',
};

@connect(({ normal, loading }) => ({
  normal,
  loading: loading.effects['normal/get'],
}))
export default class BasicProfile extends Component {
  insuranceColumns = [
    {
      title: 'id',
      dataIndex: 'i',
      sorter: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '名称',
      dataIndex: 'name',
      render: val => (
        <Ellipsis length={25} tooltip>
          {val}
        </Ellipsis>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      sorter: true,
      render: val => `${val / 100}`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '销量',
      dataIndex: 'sales',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      render(val) {
        return <Badge status={insuranceStatusMap[val]} text={insuranceStatus[val]} />;
      },
    },
    {
      title: '操作',
      key: 'operation',
      render: (val, record) => (
        <Popconfirm
          title="确认下移除产品?"
          onConfirm={() => {
            this.handleRemoveInsurance(record.i);
          }}
          okText="确认"
          cancelText="取消"
        >
          <a>移除</a>
        </Popconfirm>
      ),
    },
  ];

  constructor(props) {
    super(props);
    const {
      location: { search },
    } = props;
    this.state = {
      item: {},
      insurances: [],
      choosedInsurance: null,
      loadingInsurance: false,
      query: parse(search, { ignoreQueryPrefix: true }),
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const {
      query: { i },
    } = this.state;
    dispatch({
      type: 'normal/get',
      payload: { i },
      callback: data => {
        const insurances = data.insurances ? data.insurances.split(',') : [];
        this.setState({
          item: {
            ...data,
            insurances,
          },
        });
        this.handleLoadInsurance(insurances);
      },
    });
  }

  handleLoadInsurance = ids => {
    if (ids.length === 0) {
      this.setState({
        insurances: [],
      });
      return;
    }
    this.setState({
      loadingInsurance: true,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'insurance/find',
      payload: {
        currentPage: 1,
        pageSize: 99,
        i: ['in', ids],
      },
      callback: ({ list }) => {
        this.setState({
          insurances: list,
          loadingInsurance: false,
        });
      },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handlePreview = (record, type) => {
    if (type === 'preview') {
      this.setState({
        modalVisible: true,
        modalTitle: '产品预览',
        qrcodeTitle: record.name,
        qrcodeSrc: `http://${location.host}/m/item_details.html?i=${record.i}&preview=true`,
      });
    } else {
      this.setState({
        modalVisible: true,
        modalTitle: '购买地址',
        qrcodeTitle: record.name,
        qrcodeSrc: `http://${location.host}/m/item_details.html?i=${record.i}`,
      });
    }
  };

  handleEdit = (model, part, type, texture, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'normal/editNormal',
      payload: {
        record: {
          ...record,
          images: record.images && record.images.join(','),
          tx_location: record.tx_location && JSON.stringify(record.tx_location),
        },
        query: {
          model,
          type,
          texture,
          part,
        },
      },
    });
  };

  handleCreateOrder = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'norder/addOrder',
      payload: { ...record },
    });
  };

  handleCopy = ({ i }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'normal/copy',
      payload: { i },
      callback: () => {
        message.success('复制成功');
      },
    });
  };

  handleOnChooseInsurance = value => {
    this.setState({
      choosedInsurance: value,
    });
  };

  @Debounce(2000)
  handleOnAddInsurance = () => {
    const { dispatch } = this.props;
    const { choosedInsurance, item } = this.state;
    if (!choosedInsurance) {
      message.error('请选择需要添加的保险产品');
      return;
    }
    if (item.insurances.indexOf(choosedInsurance.toString()) !== -1) {
      message.error('您已经添加过该产品了');
      return;
    }
    const list = [...item.insurances, choosedInsurance.toString()];
    dispatch({
      type: 'normal/publicPost',
      payload: {
        insurances: list.join(','),
        i: item.i,
      },
      callback: () => {
        this.setState({
          item: {
            ...item,
            insurances: list,
          },
        });
        this.handleLoadInsurance(list);
        message.success('添加成功');
      },
    });
  };

  handleRemoveInsurance = i => {
    const { dispatch } = this.props;
    const { item } = this.state;
    const list = [...item.insurances];
    const index = list.indexOf(i.toString());
    list.splice(index, 1);
    dispatch({
      type: 'normal/publicPost',
      payload: {
        insurances: list.join(','),
        i: item.i,
      },
      callback: () => {
        this.setState({
          item: {
            ...item,
            insurances: list,
          },
        });
        this.handleLoadInsurance(list);
        message.success('移除成功');
      },
    });
  };

  handleChangeState = type => {
    const { dispatch } = this.props;
    const { item } = this.state;
    dispatch({
      type: `normal/${type}`,
      payload: { i: item.i },
      callback: data => {
        message.success('操作成功');
        this.setState({
          item: {
            ...item,
            state: data[0].state,
          },
        });
      },
    });
  };

  renderAction = record => (
    <Menu>
      <Menu.Item>
        <Link
          to={{
            pathname: '/normal/orders',
            search: `item_i=${record.i}`,
          }}
        >
          查看订单
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={{
            pathname: '/poster',
            search: `item_i=${record.i}&type=normal`,
          }}
        >
          产品海报
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to={{
            pathname: '/album',
            search: `item_i=${record.i}`,
          }}
        >
          相册图库
        </Link>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handlePreview(record, 'preview')}>产品预览</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handlePreview(record, 'real')}>商城地址</a>
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

  render() {
    const {
      item,
      insurances,
      loadingInsurance,
      modalTitle,
      modalVisible,
      qrcodeSrc,
      qrcodeTitle,
    } = this.state;
    const Action = (
      <div>
        {item.state === 1 ? (
          <Popconfirm
            title="确认下架该产品?"
            onConfirm={() => this.handleChangeState('close')}
            okText="确认"
            cancelText="取消"
          >
            <Button type="danger" ghost style={{ marginRight: 8 }}>
              下架
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="确认上架该产品?"
            onConfirm={() => this.handleChangeState('open')}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" ghost style={{ marginRight: 8 }}>
              上架
            </Button>
          </Popconfirm>
        )}
        <Dropdown overlay={this.renderAction(item)} placement="bottomCenter">
          <Button className="ant-dropdown-link">
            更多操作
            <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    );
    return (
      <PageHeaderWrapper>
        <Card bordered={false} title={item.name} extra={Action}>
          <DescriptionList size="large" title="系统信息" style={{ marginBottom: 32 }} col="4">
            <Description term="id">{item.i}</Description>
            <Description term="状态">{status[item.state]}</Description>
            <Description term="类型">{`${item.type}/${textures[item.texture]}`}</Description>
            <Description term="销量">{item.sales}</Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 16 }} title="核心信息" col="4">
            <Description term="产品人">{item.product_person_name}</Description>
            <Description term="供应商">{item.supplier_name}</Description>
            <Description term="商城">{item.is_display === 'TRUE' ? '展示' : '不展示'}</Description>
            <Description term="酒店名称">{item.hotel_name}</Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 32 }} col="1">
            <Description term="名称">{item.name}</Description>
          </DescriptionList>
          <DescriptionList size="large" title="商城信息" style={{ marginBottom: 32 }} col="1">
            <Description term="标题">{item.title}</Description>
            <Description term="简介">{item.intro}</Description>
            <Description term="标签">{item.tags}</Description>
            <Description term="通知手机">{item.notice_mobile}</Description>
            <Description term="服务电话">{item.tel}</Description>
            <Description term="酒店星级">{item.hotel_star}</Description>
            <Description term="地址">{item.address}</Description>
          </DescriptionList>
        </Card>
        {item.i ? <PackageList item={item} /> : null}
        <Card bordered={false} title="包含保险" style={{ marginTop: 32 }}>
          <Table
            rowKey="i"
            dataSource={insurances}
            pagination={false}
            loading={loadingInsurance}
            columns={this.insuranceColumns}
          />
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
