import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Menu, Dropdown, Icon, Button, message, Modal, Popconfirm } from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
import DescriptionList from '@/components/DescriptionList';
import QRCode from 'qrcode-react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PackageList from './PresalePackageList';

const { Description } = DescriptionList;

const status = {
  BEFORE: '未开始',
  ING: '进行中',
  AFTER: '已结束',
  CLOSE: '已关闭',
  DELETE: '已删除',
};

@connect(({ presale, loading }) => ({
  presale,
  loading: loading.effects['presale/get'],
}))
export default class BasicProfile extends Component {
  state = {
    item: {},
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const {
      query: { i },
    } = this.state;
    dispatch({
      type: 'presale/get',
      payload: { i },
      callback: data => {
        this.setState({
          item: {
            ...data,
          },
        });
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
        qrcodeTitle: record.title,
        qrcodeSrc: `http://${location.host}/m/presale_details.html?i=${record.i}&preview=true`,
      });
    } else {
      this.setState({
        modalVisible: true,
        modalTitle: '商城地址',
        qrcodeTitle: record.title,
        qrcodeSrc: `http://${location.host}/m/presale_details.html?i=${record.i}`,
      });
    }
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

  handleChangeState = type => {
    const { dispatch } = this.props;
    const { item } = this.state;
    dispatch({
      type: `presale/${type}`,
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
        <a onClick={() => this.handlePreview(record, 'preview')}>产品预览</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handlePreview(record, 'real')}>商城地址</a>
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

  render() {
    const { item } = this.state;
    const location = {
      search: `rush_i=${item.i}&title=${item.title}&team_no=${item.team_no || ''}`,
    };
    const Action = (
      <div>
        {item.state !== 'CLOSE' ? (
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
        <Card bordered={false} title={item.title} extra={Action}>
          <DescriptionList size="large" title="系统信息" style={{ marginBottom: 32 }} col="4">
            <Description term="id">{item.i}</Description>
            <Description term="状态">{status[item.state]}</Description>
            <Description term="预售数量">{item.inventory}</Description>
            <Description term="销量">{item.sales}</Description>
          </DescriptionList>
          <DescriptionList size="large" title="产品信息" style={{ marginBottom: 32 }} col="1">
            <Description term="标题">{item.title}</Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 16 }} col="4">
            <Description term="产品人">{item.product_person_name}</Description>
            <Description term="供应商">{item.supplier_name}</Description>
            <Description term="价格">{item.price / 100}</Description>
            <Description term="佣金">{item.commission / 100}</Description>
            <Description term="预售时间">
              {item.rush_begin_time && item.rush_begin_time.substring(0, 10)}~
              {item.rush_end_time && item.rush_end_time.substring(0, 10)}
            </Description>
            <Description term="发码时间">
              {item.send_code_time && item.send_code_time.substring(0, 10)}
            </Description>
            <Description term="使用时间">
              {item.use_begin_time && item.use_begin_time.substring(0, 10)}~
              {item.use_end_time && item.use_end_time.substring(0, 10)}
            </Description>
            <Description term="满减优惠">
              {`满${item.discount_limit_num}减${item.discount_reduce / 100}`}
            </Description>
            <Description term="最小购买数">{item.min_pay_num}</Description>
            <Description term="最大购买数">{item.max_pay_num}</Description>
            <Description term="每份电子码">{item.create_ecode_num}</Description>
            <Description term="团号">{item.team_no}</Description>
          </DescriptionList>
        </Card>
        {item.i ? <PackageList item={item} location={location} /> : null}
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
