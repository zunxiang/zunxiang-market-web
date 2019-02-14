import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { Card, Table, Divider, Button, Upload, Icon, message, Tag } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { orderType, orderStatus, orderStatusMap } from './common';
import styles from './OrderDetail.less';

const { Description } = DescriptionList;

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

const visitorColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '身份证号',
    dataIndex: 'id_no',
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
  billLoading: loading.effects['bill/pureFind'],
}))
export default class NormalOrderDetail extends Component {
  state = {
    logs: [],
    query: parse(this.props.location.search, { ignoreQueryPrefix: true }),
    uploading: false,
    order: {},
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

  handleOnUploadChange = info => {
    if (info.file.status !== 'uploading') {
      this.setState({
        uploading: true,
      });
    }
    if (info.file.status === 'done') {
      const { response } = info.file;
      const { dispatch } = this.props;
      const { order } = this.state;
      if (response[0] === 0) {
        dispatch({
          type: 'norder/importVistors',
          payload: {
            i: order.i,
            visitors: JSON.stringify(response[1]),
          },
          callback: () => {
            this.setState({
              uploading: false,
            });
            message.success('导入成功');
          },
        });
      } else {
        message.error(response[1]);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 导入失败，请稍后在试`);
      this.setState({
        uploading: false,
      });
    }
  };

  handleCopy = () => {
    const { dispatch } = this.props;
    const { order } = this.state;
    const newOrder = { ...order };
    delete newOrder.i;
    dispatch({
      type: 'norder/copyOrder',
      payload: newOrder,
    });
  };

  renderFranchiser = record => {
    if (record.salesman_i) {
      return (
        <Description term="分销">{`${record.salesman_name}(${record.salesman_i})`}</Description>
      );
    }
    if (record.franchiser_i) {
      return (
        <Description term="分销">{`${record.franchiser_name}(${record.franchiser_i})`}</Description>
      );
    }
    return null;
  };

  render() {
    const { billLoading, loading } = this.props;
    const { order, uploading, logs } = this.state;
    const uploadProps = {
      name: 'file',
      action: '/db/v2/merchant/import_visitors',
      accept: 'application/vnd.ms-excel',
      onChange: this.handleOnUploadChange,
      showUploadList: false,
    };
    const Action = (
      <Fragment>
        <Button loading={loading}>退款</Button>
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
            <Description term="订单类型">{orderType[order.item_type]}</Description>
            <Description term="状态">
              <Tag color={orderStatusMap[order.state]}>{orderStatus[order.state]}</Tag>
            </Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="产品信息" style={{ marginBottom: 15 }} col={1}>
            <Description term="产品名称">{order.item_title}</Description>
            <Description term="套餐">{order.package_name}</Description>
            <Description term="房型">{order.package ? `${order.package.room}` : ''}</Description>
          </DescriptionList>
          <DescriptionList size="large" style={{ marginBottom: 32 }} col={4}>
            <Description term="酒店名称">{order.hotel_name}</Description>
          </DescriptionList>
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
            <Description term="佣金">{order.fee && order.fee / 100}</Description>
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="内部备注" style={{ marginBottom: 32 }} col={1}>
            {order.message && order.message.length > 0 ? (
              order.message.map(val => (
                <Description term={val.time.substring(5, 16)} key={val.time}>
                  {val.message}
                </Description>
              ))
            ) : (
              <Description term="">无</Description>
            )}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <DescriptionList size="large" title="操作备注" style={{ marginBottom: 32 }} col={1}>
            {!order.supplier_remarks &&
            !order.finish_remarks &&
            !order.cancel_remarks &&
            !order.merchant_remarks &&
            !order.change_remarks ? (
              <Description term="">无</Description>
            ) : (
              ''
            )}
            {order.merchant_remarks ? (
              <Description term="发单备注">{order.merchant_remarks}</Description>
            ) : (
              ''
            )}
            {order.supplier_remarks ? (
              <Description term="供应商备注">{order.supplier_remarks}</Description>
            ) : (
              ''
            )}
            {order.finish_remarks ? (
              <Description term="完成备注">{order.finish_remarks}</Description>
            ) : (
              ''
            )}
            {order.cancel_remarks ? (
              <Description term="拒绝备注">{order.cancel_remark}</Description>
            ) : (
              ''
            )}
            {order.change_remarks ? (
              <Description term="改期备注">{order.change_remarks}</Description>
            ) : (
              ''
            )}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>每日费用详情</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            rowKey="date"
            dataSource={order.skus || []}
            columns={order.item_texture === 'GROUP' ? groupSkusColumns : skusColumns}
          />
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>操作日志</div>
          <Table
            style={{ marginBottom: 16 }}
            loading={billLoading}
            rowKey="i"
            dataSource={logs}
            columns={logColumns}
          />
          {order.item_texture === 'GROUP' ? (
            <Fragment>
              <Divider style={{ marginBottom: 32 }} />
              <div className={styles.title}>
                团员信息
                <div className={styles.action}>
                  <Upload {...uploadProps}>
                    <Button type="primary" ghost loading={uploading}>
                      <Icon type="upload" /> 导入团员信息
                    </Button>
                  </Upload>
                  <Button
                    href="http://otmj4apgs.bkt.clouddn.com/%E8%B7%9F%E5%9B%A2%E6%B8%B8%E6%88%90%E5%91%98%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls"
                    type="default"
                    style={{ marginLeft: 8 }}
                  >
                    下载模板文件
                  </Button>
                </div>
              </div>
              <Table
                style={{ marginBottom: 24 }}
                rowKey="name"
                dataSource={order.visitors || []}
                columns={visitorColumns}
              />
            </Fragment>
          ) : (
            ''
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}
