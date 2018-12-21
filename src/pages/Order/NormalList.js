import React, { Fragment } from 'react';
import { List, Row, Col, Tag } from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import styles from './NormalList.less';

const statusMap = {
  WAIT: '#bfbfbf',
  SUCCESS: '#52c41a',
  EDITED: '#faad14',
  CANCEL: '#bfbfbf',
  HANDLING: '#13c2c2',
  FINISH: '#1890ff',
  REQUEST_DELETE: '#eb2f96',
  DELETE: '#bfbfbf',
  REQUEST_CHANGE: '#eb2f96',
  CHANGE: '#1890ff',
  SETTLED: '#722ed1',
  CLOSED: '#bfbfbf',
};
const status = {
  WAIT: '待支付',
  SUCCESS: '已支付',
  EDITED: '已编辑',
  CANCEL: '已拒绝',
  HANDLING: '待确定',
  FINISH: '已确认',
  REQUEST_DELETE: '待撤销',
  DELETE: '已撤销',
  REQUEST_CHANGE: '待改约',
  CHANGE: '已改约',
  SETTLED: '已结算',
  CLOSED: '已关闭',
};

const DateInfo = props => {
  const { order: o } = props;
  if (o.item_texture === 'HOTEL') {
    return (
      <Fragment>
        <div>{`${o.item_num}间${o.skus.length}晚`}</div>
        <div>{`入住：${o.departure_time.substring(0, 10)}`}</div>
        <div>{`离开：${o.return_time.substring(0, 10)}`}</div>
      </Fragment>
    );
  }
  if (o.item_texture === 'GROUP') {
    return (
      <Fragment>
        <div>
          <span style={{ marginRight: 8 }}>{`${o.adult_num}大${o.child_num}小`}</span>
        </div>
        <div>{`日期：${o.departure_time.substring(0, 10)}`}</div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <div>{`数量：${o.item_num}份`}</div>
      <div>{`日期：${o.departure_time && o.departure_time.substring(0, 10)}`}</div>
    </Fragment>
  );
};

export const ListContent = props => {
  const { order: o } = props;
  return (
    <div className={styles.orderWrap}>
      <div className={styles.orderHeader}>
        <div>
          <Link
            to={{
              pathname: '/presale/order-detail',
              search: `order_i=${o.i}`,
            }}
          >
            {`常规订单: ${o.order_no}`}
          </Link>
          <span className={styles.marginLeft32}>
            {`创建时间: ${o.create_time.substring(0, 19)}`}
          </span>
          <span className={styles.marginLeft32}>{`供应商：${o.merchant_name}`}</span>
        </div>
        <div>
          <Tag color={statusMap[o.state]}>{status[o.state]}</Tag>
        </div>
      </div>
      <div className={styles.orderBody}>
        <Row type="flex" justify="space-between" align="middle" gutter={16}>
          <Col span={8}>
            <div>
              <Link
                to={{
                  pathname: '/normal/detail',
                  search: `i=${o.item_i}`,
                }}
              >
                <Ellipsis lines={1} tooltip className={styles.color59}>
                  {`产品: ${o.item_name}`}
                </Ellipsis>
              </Link>
            </div>
            <div>
              <Ellipsis lines={1} tooltip>
                {`套餐: ${o.package_name}`}
              </Ellipsis>
            </div>
            {o.item_texture === 'HOTEL' ? (
              <div>
                {o.package.room}
                <span style={{ marginLeft: 12 }}>{o.package.content}</span>
              </div>
            ) : null}
          </Col>
          <Col span={4}>
            <div>
              {o.contacts}
            </div>
            <div>{o.contacts_mobile}</div>
          </Col>
          <Col span={4}>
            <DateInfo order={o} />
          </Col>
          <Col span={4}>
            <div>
              金额：￥
              {o.amount / 100}
            </div>
            <div>
              佣金：￥
              {o.commission / 100 || 0}
            </div>
          </Col>
          <Col span={2}>
            <div style={{ textAlign: 'right' }}>
              <Link
                to={{
                  pathname: '/normal/order-detail',
                  search: `order_i=${o.i}`,
                }}
              >
                查看详情
              </Link>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.orderFooter}>
        <div className={styles.footerLeft}>
          <div>{`备注：${o.remarks || ''}`}</div>
          <div>{`分销：${o.salesman_name || '无'}`}</div>
        </div>
      </div>
    </div>
  );
};

const NormalList = props => (
  <List
    {...props}
    className={styles.normalList}
    renderItem={item => (
      <List.Item>
        <ListContent order={item} />
      </List.Item>
    )}
  />
);

export default NormalList;
export const NormalListContent = ListContent;
