import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { Card, Table, Divider, Button, Tag, Modal, message } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { orderType, orderStatus, orderStatusMap } from './common';
import Prompt from '@/components/Prompt';
import styles from './OrderDetail.less';

const { Description } = DescriptionList;
const { confirm } = Modal;
const salesmanLevel = ['一级', '二级', '三级', '四级', '五级'];
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
    dataIndex: 'content',
    render: val => (
      <Ellipsis length={30} tooltip>
        {val}
      </Ellipsis>
    ),
  },
  {
    title: '操作者',
    dataIndex: 'operator',
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
  };

  componentDidMount = () => {
    this.loadData();
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
          order: {
            ...data,
            fee_details: data.fee_details ? JSON.parse(data.fee_details) : [],
          },
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

  render() {
    const { billLoading, loading } = this.props;
    const { order, logs, showPrompt, promptInit } = this.state;
    const Action = (
      <Fragment>
        {order.state === 2 ? (
          <Button
            type="primary"
            onClick={this.handleOnConfirm}
            loading={loading}
            style={{ marginRight: 8 }}
          >
            确认
          </Button>
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
          <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }} col={4}>
            <Description term="下单时间">
              {order.create_time && order.create_time.substring(0, 19)}
            </Description>
            <Description term="订单号">{order.order_no}</Description>
            <Description term="订单类型">
              {orderType[`${order.item_class}_${order.item_type}`]}
            </Description>
            <Description term="状态">
              <Tag color={orderStatusMap[order.state]}>{orderStatus[order.state]}</Tag>
            </Description>
            <Description term="流水号">{order.trade_no}</Description>
            <Description term="订单来源">{refer[order.source]}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="产品信息" style={{ marginBottom: 15 }} col={1}>
            <Description term="产品名称">{order.item_title}</Description>
            {order.item_class === 'NORMAL' && (
              <>
                <Description term="套餐">{order.package_name}</Description>
                {order.item_type === 'HOTEL' && (
                  <Description term="房型">
                    {order.package ? `${order.package.room}` : ''}
                  </Description>
                )}
              </>
            )}
          </DescriptionList>
          {order.item_class === 'NORMAL' && order.item_type === 'HOTEL' && (
            <DescriptionList size="large" style={{ marginBottom: 32 }} col={4}>
              <Description term="酒店名称">{order.hotel_name}</Description>
            </DescriptionList>
          )}
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="用户信息" style={{ marginBottom: 32 }} col={4}>
            <Description term="用户姓名">{order.contacts}</Description>
            <Description term="联系电话">{order.contacts_mobile}</Description>
            <Description term="备注">{order.remarks || '无'}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="金额信息" style={{ marginBottom: 32 }} col={4}>
            <Description term="单价">{order.item_price && order.item_price / 100}</Description>
            <Description term="数量">{order.item_num}</Description>
            <Description term="金额">{order.amount && order.amount / 100}</Description>
            <Description term="佣金">{order.total_fee && order.total_fee / 100}</Description>
          </DescriptionList>
          {order.item_class === 'NORAML' && (
            <>
              <Divider style={{ marginBottom: 32 }} />
              <div className={styles.title}>每日费用详情</div>
              <Table
                style={{ marginBottom: 24 }}
                pagination={false}
                rowKey="date"
                dataSource={order.skus || []}
                columns={order.item_type === 'GROUP' ? groupSkusColumns : skusColumns}
              />
            </>
          )}
          {order.item_type === 'GROUP' ? (
            <Fragment>
              <div className={styles.title}>团员信息</div>
              <Table
                style={{ marginBottom: 24 }}
                rowKey="i"
                dataSource={order.travellers || []}
                columns={visitorColumns}
                scroll={{ x: 700 }}
              />
            </Fragment>
          ) : (
            ''
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}
