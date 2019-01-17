import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Button, message, Modal, Popconfirm } from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
import DescriptionList from '@/components/DescriptionList';
import Debounce from 'lodash-decorators/debounce';
import QRCode from 'qrcode-react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PackageList from './NormalPackageList';
import { NormalTypes } from './common';

const { Description } = DescriptionList;

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
  constructor(props) {
    super(props);
    const {
      location: { search },
    } = props;
    this.state = {
      item: {},
      choosedInsurance: null,
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
        this.setState({
          item: {
            ...data,
          },
        });
        this.handleGetContet(data.rich_text_content_i);
      },
    });
  }

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

  handleEdit = (model, type, record) => {
    const { dispatch } = this.props;
    const { content } = this.state;
    dispatch({
      type: 'normal/editNormal',
      payload: {
        record: {
          ...record,
          images: record.images ? record.images.split(',') : [],
          origin_tx_location: record.origin_tx_location && JSON.parse(record.origin_tx_location),
          tags: record.tags ? record.tags.split(',') : [],
          content,
        },
        query: {
          model,
          type,
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

  handleGetContet(i) {
    const { dispatch } = this.props;
    dispatch({
      type: 'normal/getContent',
      payload: { i },
      callback: data => {
        this.setState({
          content: data.content,
        });
      },
    });
  }

  renderAction = record => (
    <Menu>
      <Menu.Item>
        <a onClick={() => this.handleEdit('edit', record.type, record)}>编辑产品</a>
      </Menu.Item>
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

  renderBaseInfo = item => (
    <DescriptionList size="small" style={{ marginBottom: 16 }} col={3}>
      <Description term="简介" col={1}>
        {item.intro}
      </Description>
      <Description term="类型">{NormalTypes[item.type]}</Description>
      <Description term="销量">{item.sales}</Description>
      <Description term="状态">{status[item.state]}</Description>
      <Description term="酒店名称" col={3}>
        {item.hotel_name}
      </Description>
      <Description term="酒店电话" col={3}>
        {item.hotel_tel}
      </Description>
      <Description term="酒店星级" col={3}>
        {item.hotel_star}
      </Description>
      <Description term="通知手机" col={3}>
        {item.notice_mobile}
      </Description>
      <Description term="地址" col={3}>
        {item.origin_address}
      </Description>
      <Description term="标签" col={3}>
        {item.tags}
      </Description>
    </DescriptionList>
  );

  render() {
    const { item, modalTitle, modalVisible, qrcodeSrc, qrcodeTitle } = this.state;
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
      <PageHeaderWrapper title={item.title} content={this.renderBaseInfo(item)} action={Action}>
        {item.i ? <PackageList item={item} /> : null}
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
