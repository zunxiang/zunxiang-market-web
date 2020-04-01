import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { Card, Table, Divider, Button, Tag, Modal, message, Descriptions } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { orderType, orderStatus, orderStatusMap } from './common';
import Prompt from '@/components/Prompt';
import FinishGoodsModal from './Form/FinishGoodsModal';

import styles from './OrderDetail.less';

const { confirm } = Modal;
const salesmanLevel = ['', '一级', '二级', '三级', '四级', '五级'];
const feeLevel = ['店返', '团返'];
const refer = {
  APPLET: '小程序',
  SUB: '公众号',
};

const skusColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    editable: false,
    render: val => val.substring(0, 10),
  },
  {
    title: '价格',
    dataIndex: 'price',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
];
const groupSkusColumns = [
  {
    title: '日期',
    dataIndex: 'date',
    editable: false,
    render: val => val.substring(0, 10),
  },
  {
    title: '成人价格',
    dataIndex: 'price',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
  {
    title: '儿童价格',
    dataIndex: 'child_price',
    inputType: 'number',
    editable: true,
    render: val => val / 100,
  },
];

const feeColumns = [
  {
    title: '描述',
    dataIndex: 'text',
  },
  {
    title: '分销',
    dataIndex: 'salesman_name',
  },
  {
    title: '分销等级',
    dataIndex: 'salesman_level',
    render: val => salesmanLevel[val],
  },
  {
    title: '佣金类型',
    dataIndex: 'fee_level',
    render: val => feeLevel[val],
  },
  {
    title: '佣金金额',
    dataIndex: 'fee',
    render: val => val / 100,
  },
];

const visitorColumns = [
  {
    title: '姓名',
    dataIndex: 'chinese_name',
  },
  {
    title: '英文名',
    key: 'english_name',
    render: val => val.english_first_name + val.english_last_name,
  },
  {
    title: '证件类型',
    dataIndex: 'id_type',
    render: val => (val === 'id_card' ? '身份证' : '护照'),
  },
  {
    title: '身份证号',
    dataIndex: 'id_no',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    render: val => (val === 'male' ? '男' : '女'),
  },
  {
    title: '类型',
    dataIndex: 'type',
    render: val => (val === 'adult' ? '成人' : '儿童'),
  },
];

const logColumns = [
  {
    title: '操作时间',
    dataIndex: 'create_time',
    render: val => val.substring(0, 19),
  },
  {
    title: 'title',
    dataIndex: 'title',
  },
  {
    title: '内容',
    dataIndex: 'message',
    render: val => (
      <Ellipsis length={30} tooltip>
        {val}
      </Ellipsis>
    ),
  },
];

const messagesColumns = [
  {
    title: '创建时间',
    dataIndex: 'create_time',
    render: val => val && val.substring(0, 19),
    width: 150,
  },
  {
    title: '内容',
    dataIndex: 'message',
    render: val => (
      <Ellipsis lines={1} tooltip>
        {val}
      </Ellipsis>
    ),
  },
];

@connect(({ norder, loading, user }) => ({
  norder,
  user,
  loading: loading.effects['norder/get'],
}))
export default class NormalOrderDetail extends Component {
  state = {
    logs: [],
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
    order: {},
    showPrompt: false,
    promptInit: '',
    messages: [],
    messagePromptVisiable: false,
  };

  componentDidMount = () => {
    this.loadData();
    this.loadMessage();
  };

  loadData = () => {
    const { dispatch } = this.props;
    const { query } = this.state;
    dispatch({
      type: 'order/get',
      payload: {
        i: query.order_i,
      },
      callback: data => {
        this.setState({
          order: { ...data },
        });
      },
    });
    dispatch({
      type: 'log/find',
      payload: {
        order_i: query.order_i,
        currentPage: 1,
        pageSize: 99,
      },
      callback: data => {
        this.setState({
          logs: data.list,
        });
      },
    });
  };

  loadMessage = () => {
    const { dispatch } = this.props;
    const { query } = this.state;
    dispatch({
      type: 'order/findMessage',
      payload: {
        order_i: query.order_i,
        currentPage: 1,
        pageSize: 99,
      },
      callback: data => {
        this.setState({
          messages: [...data.list],
        });
      },
    });
  };

  handlerOnFinishGoods = fields => {
    const { dispatch } = this.props;
    const {
      order: { i },
    } = this.state;
    dispatch({
      type: 'order/finish',
      payload: { i, ...fields },
      callback: data => {
        this.setState({
          promptInit: data,
          showPrompt: true,
        });
        this.loadData();
      },
    });
  };

  handleOnConfirm = () => {
    const { dispatch } = this.props;
    const {
      order: { i },
    } = this.state;
    confirm({
      title: '确认信息',
      content: '确认接受该订单吗？',
      onOk: () => {
        dispatch({
          type: 'order/finish',
          payload: { i },
          callback: data => {
            this.setState({
              promptInit: data,
              showPrompt: true,
            });
            this.loadData();
          },
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  handleOnRefund = () => {
    const { dispatch } = this.props;
    const {
      order: { i },
    } = this.state;
    confirm({
      title: '确认信息',
      content: '确认该订单退款给客户吗？',
      onOk: () => {
        dispatch({
          type: 'order/refund',
          payload: {
            i,
          },
          callback: () => {
            this.loadData();
          },
        });
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  handlePromptCancel = () => {
    this.setState({
      showPrompt: false,
    });
  };

  handlePromptSubmit = value => {
    const { dispatch } = this.props;
    const {
      query: { order_i: i },
    } = this.state;
    dispatch({
      type: 'order/sendSms',
      payload: {
        i,
        ...value,
      },
      callback: () => {
        message.success('发送成功');
      },
    });
  };

  handleGetSms = () => {
    const { dispatch } = this.props;
    const {
      query: { order_i: i },
    } = this.state;
    dispatch({
      type: 'order/getSms',
      payload: {
        i,
      },
      callback: data => {
        this.setState({
          promptInit: data,
          showPrompt: true,
        });
      },
    });
  };

  handleShowMessagePrompt = flag => {
    this.setState({
      messagePromptVisiable: !!flag,
    });
  };

  handleAddMessage = msg => {
    const { dispatch } = this.props;
    const { query } = this.state;
    dispatch({
      type: 'order/addMessage',
      payload: {
        order_i: query.order_i,
        message: msg.message,
      },
      callback: () => {
        message.success('添加成功');
        this.loadMessage();
        this.handleShowMessagePrompt(false);
      },
    });
  };

  render() {
    const { billLoading, loading } = this.props;
    const { order, logs, showPrompt, promptInit, messages, messagePromptVisiable } = this.state;
    const Action = (
      <Fragment>
        {order.state === 2 && order.item_type !== 'GOODS' ? (
          <Button
            type="primary"
            onClick={this.handleOnConfirm}
            loading={loading}
            style={{ marginRight: 8 }}
          >
            确认
          </Button>
        ) : null}
        {order.state === 2 && order.item_type === 'GOODS' ? (
          <FinishGoodsModal onSubmit={this.handlerOnFinishGoods}>
            <Button type="primary" loading={loading} style={{ marginRight: 8 }}>
              发货
            </Button>
          </FinishGoodsModal>
        ) : null}
        {[2, 3].includes(order.state) ? (
          <>
            <Button loading={loading} onClick={this.handleOnRefund}>
              退款
            </Button>
            <Button
              type="primary"
              ghost
              onClick={this.handleGetSms}
              loading={loading}
              style={{ marginLeft: 8 }}
            >
              重发短信
            </Button>
          </>
        ) : null}
      </Fragment>
    );
    return (
      <PageHeaderWrapper>
        <Card title={order.order_no} extra={Action}>
          <Descriptions size="large" title="订单信息" column={4}>
            <Descriptions.Item label="下单时间">
              {order.create_time && order.create_time.substring(0, 19)}
            </Descriptions.Item>
            <Descriptions.Item label="订单号">{order.order_no}</Descriptions.Item>
            <Descriptions.Item label="订单类型">
              {orderType[`${order.item_class}_${order.item_type}`]}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={orderStatusMap[order.state]}>{orderStatus[order.state]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="流水号">{order.trade_no}</Descriptions.Item>
            <Descriptions.Item label="订单来源">{refer[order.source]}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 16 }} />
          <Descriptions size="large" title="产品信息" column={1}>
            <Descriptions.Item label="产品名称">{order.item_title}</Descriptions.Item>
            {order.item_class === 'NORMAL' && (
              <Descriptions.Item label="套餐">{order.package_name}</Descriptions.Item>
            )}
            {order.item_class === 'NORMAL' && order.item_type === 'HOTEL' && (
              <Descriptions.Item label="房型">
                {order.package ? `${order.package.room}` : ''}
              </Descriptions.Item>
            )}
          </Descriptions>
          {order.item_class === 'NORMAL' && order.item_type === 'HOTEL' && (
            <Descriptions size="large" style={{ marginBottom: 16 }} column={4}>
              <Descriptions.Item label="酒店名称">{order.hotel_name}</Descriptions.Item>
            </Descriptions>
          )}
          <Divider style={{ marginBottom: 16 }} />
          <Descriptions size="large" title="用户信息" column={3}>
            <Descriptions.Item label="用户姓名">{order.contacts}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{order.contacts_mobile}</Descriptions.Item>
            {order.item_type === 'GOODS' && (
              <Descriptions.Item label="收货地址">{order.shipping_address}</Descriptions.Item>
            )}
            <Descriptions.Item label="备注">{order.contacts_remarks || '无'}</Descriptions.Item>
          </Descriptions>
          {order.item_class === 'NORMAL' && order.item_type === 'GOODS' && (
            <Descriptions size="large" title="发货信息" column={3}>
              <Descriptions.Item label="快递名称">{order.shipper_name}</Descriptions.Item>
              <Descriptions.Item label="快递单号">{order.courier_number}</Descriptions.Item>
              <Descriptions.Item label="发货时间">
                {order.finish_time && order.finish_time.substring(0, 19)}
              </Descriptions.Item>
            </Descriptions>
          )}
          <Divider style={{ marginBottom: 16 }} />
          <Descriptions size="large" title="金额信息" column={4}>
            <Descriptions.Item label="单价">
              {order.item_price && order.item_price / 100}
            </Descriptions.Item>
            <Descriptions.Item label="数量">{order.item_num}</Descriptions.Item>
            <Descriptions.Item label="金额">{order.amount && order.amount / 100}</Descriptions.Item>
            <Descriptions.Item label="佣金">
              {order.total_fee && order.total_fee / 100}
            </Descriptions.Item>
          </Descriptions>
          {order.item_class === 'NORMAL' && order.item_type === 'HOTEL' && (
            <Descriptions size="large" column={4}>
              <Descriptions.Item label="入住时间">{order.start_time}</Descriptions.Item>
              <Descriptions.Item label="离开时间">{order.end_time}</Descriptions.Item>
              <Descriptions.Item label="间夜数">
                {order.item_num} 间 {order.skus.length} 晚
              </Descriptions.Item>
            </Descriptions>
          )}
          <Divider style={{ marginBottom: 16 }} />
          <div className={styles.title}>
            备注记录
            <Button
              type="primary"
              ghost
              size="small"
              className={styles.action}
              onClick={() => this.handleShowMessagePrompt(true)}
            >
              添加
            </Button>
          </div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            rowKey="i"
            dataSource={messages}
            columns={messagesColumns}
          />
          {order.item_class === 'NORMAL' && order.item_type !== 'GOODS' && (
            <>
              <Divider style={{ marginBottom: 32 }} />
              <div className={styles.title}>每日费用详情</div>
              <Table
                style={{ marginBottom: 24 }}
                pagination={false}
                rowKey="date"
                dataSource={order.skus}
                columns={order.item_type === 'GROUP' ? groupSkusColumns : skusColumns}
              />
            </>
          )}
          {order.item_type === 'GROUP' && (
            <>
              <div className={styles.title}>团员信息</div>
              <Table
                style={{ marginBottom: 24 }}
                rowKey="i"
                dataSource={order.travellers}
                columns={visitorColumns}
                scroll={{ x: 700 }}
              />
            </>
          )}
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>佣金明细</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            rowKey="salesman_i"
            dataSource={order.fee_details}
            columns={feeColumns}
          />
          <div className={styles.title}>操作记录</div>
          <Table
            style={{ marginBottom: 16 }}
            loading={billLoading}
            rowKey="i"
            dataSource={logs}
            columns={logColumns}
          />
          <Prompt
            title="发送通知短信"
            label="短信内容"
            error="请输入短信内容"
            name="sms_content"
            onOk={this.handlePromptSubmit}
            onCancel={this.handlePromptCancel}
            modalVisible={showPrompt}
            type="textArea"
            initialValue={promptInit}
          />
          <Prompt
            title="添加备注"
            label="备注内容"
            error="请输入备注内容"
            name="message"
            onOk={this.handleAddMessage}
            onCancel={() => this.handleShowMessagePrompt(false)}
            modalVisible={messagePromptVisiable}
            type="textArea"
            initialValue=""
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
