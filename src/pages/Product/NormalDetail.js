import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Dropdown, Icon, Button, message, Modal, Popconfirm, Card, Descriptions } from 'antd';
import { Link } from 'dva/router';
import { parse, stringify } from 'qs';
import QRCode from 'qrcode-react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PackageList from './NormalPackageList';
import { NormalTypes } from './common';
import PresaleInfo from './Detail/PresaleInfo';
import Poster from './Poster.tsx';

const status = {
  0: '已下架',
  1: '出售中',
  2: '已售罄',
};

@connect(({ normal, user, loading }) => ({
  normal,
  userid: `${user.currentUser.userid}`,
  mpid: user.currentUser.mpid,
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
      query: parse(search, { ignoreQueryPrefix: true }),
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
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
            notice_accounts: data.notice_accounts ? data.notice_accounts.split(',') : [],
            poster: data.poster ? data.poster.split(',') : [],
            fee: data.fee ? JSON.parse(data.fee) : [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
          },
        });
        this.handleGetContent(data.rich_text_content_i);
      },
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handlePreview = (record, type) => {
    const { mpid } = this.props;
    const str = stringify({
      scene: stringify({
        i: record.i,
      }),
      page: 'pages/detail/main',
      width: 280,
      auto_color: true,
      is_hyaline: true,
    });
    if (type === 'preview') {
      this.setState({
        modalVisible: true,
        modalTitle: '产品预览',
        qrcodeTitle: record.title,
        qrcodeSrc: `http://${location.host}/m/item_details.html?i=${record.i}&preview=true`,
        mpCodeSrc: `https://www.zxtgo.com/production/${mpid}//db/v1/client/miniprogram_qrcode?${str}`,
      });
    } else {
      this.setState({
        modalVisible: true,
        modalTitle: '购买地址',
        qrcodeTitle: record.title,
        qrcodeSrc: `http://${location.host}/m/item_details.html?i=${record.i}`,
        mpCodeSrc: `https://www.zxtgo.com/production/${mpid}//db/v1/client/miniprogram_qrcode?${str}`,
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
        itemClass: record.item_class === 'NORMAL' ? 'normal' : 'presale',
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

  handleSubscript = type => {
    const { dispatch } = this.props;
    const {
      item: { i },
    } = this.state;
    dispatch({
      type: `normal/${type}`,
      payload: { i },
      callback: data => {
        message.success('操作成功');
        this.setState({
          item: {
            ...data,
            poster: data.poster ? data.poster.split(',') : [],
            notice_accounts: data.notice_accounts ? data.notice_accounts.split(',') : [],
          },
        });
      },
    });
  };

  handleUploadPoster = posters => {
    const { dispatch } = this.props;
    const { item } = this.state;
    dispatch({
      type: 'normal/publicPost',
      payload: {
        i: item.i,
        poster: posters.join(','),
      },
      callback: () => {
        this.setState({
          item: {
            ...item,
            poster: [...posters],
          },
        });
      },
    });
  };

  handleGetContent(i) {
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
            pathname: '/order/list',
            search: `item_i=${record.i}`,
          }}
        >
          查看订单
        </Link>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handlePreview(record, 'preview')}>产品预览</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handlePreview(record, 'real')}>商城地址</a>
      </Menu.Item>
    </Menu>
  );

  renderBaseInfo = item => (
    <Descriptions size="small" style={{ marginBottom: 16 }} column={3}>
      <Descriptions.Item label="简介" span={3}>
        {item.intro}
      </Descriptions.Item>
      <Descriptions.Item label="类型">{NormalTypes[item.type]}</Descriptions.Item>
      <Descriptions.Item label="销量">{item.sales}</Descriptions.Item>
      <Descriptions.Item label="状态">{status[item.state]}</Descriptions.Item>
      <Descriptions.Item label="酒店名称">{item.hotel_name}</Descriptions.Item>
      <Descriptions.Item label="酒店电话">{item.hotel_tel}</Descriptions.Item>
      <Descriptions.Item label="酒店星级">{item.hotel_star}</Descriptions.Item>
      <Descriptions.Item label="地址">{item.origin_address}</Descriptions.Item>
      <Descriptions.Item label="标签">{item.tags}</Descriptions.Item>
    </Descriptions>
  );

  render() {
    const { userid, loading } = this.props;
    const { item, modalTitle, modalVisible, qrcodeSrc, qrcodeTitle, mpCodeSrc } = this.state;
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
        {item.notice_accounts && item.notice_accounts.includes(userid) ? (
          <Popconfirm
            title="确认取消订阅?"
            onConfirm={() => this.handleSubscript('unsubscript')}
            okText="确认"
            cancelText="取消"
          >
            <Button type="danger" ghost style={{ marginRight: 8 }}>
              取消订阅
            </Button>
          </Popconfirm>
        ) : (
          <Popconfirm
            title="确认订阅该产品?"
            onConfirm={() => this.handleSubscript('subscript')}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" ghost style={{ marginRight: 8 }}>
              订阅通知
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
      <PageHeaderWrapper title={`[id:${item.i}] ${item.title}`} action={Action}>
        <Card title="基本信息" style={{ marginBottom: 16 }} loading={loading}>
          {this.renderBaseInfo(item)}
        </Card>
        {item.i && item.item_class === 'RUSH' && <PresaleInfo item={item} />}
        {item.i && item.item_class === 'NORMAL' && <PackageList item={item} />}
        <div style={{ marginTop: 16 }}>
          {item.i && <Poster data={item.poster} onUpload={this.handleUploadPoster} />}
        </div>
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
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <div>小程序路径</div>
            <div>
              <a>pages/detail/main?scene=i%3D{item.i}</a>
            </div>
            <div>小程序码</div>
            <div style={{ display: 'inline-block', marginLeft: 'auto', marginRight: 'auto' }}>
              <img src={mpCodeSrc} alt="小程序码" style={{ width: 150 }} />
            </div>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
