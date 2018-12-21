import React, { Fragment } from 'react';
import { List, Row, Col, Tag } from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import styles from './NormalList.less';

const statusMap = {
  SUCCESS: '#52c41a',
  ERROR: '#bfbfbf',
  CLOSED: '#bfbfbf',
  WAIT: '#fa8c16',
  CANCEL: '#bfbfbf',
  FINISH: '#1890ff',
  REQUEST_DELETE: '#fa8c16',
  DELETE: '#bfbfbf',
  REQUEST_CHANGE: '#fa8c16',
  CHANGE: '#1890ff',
  SETTLED: '#722ed1',
};
const status = {
  SUCCESS: '待确认',
  ERROR: 'ERROR',
  CLOSED: '已关闭',
  WAIT: '待支付',
  CANCEL: '已拒绝',
  FINISH: '已确认',
  REQUEST_DELETE: '待撤销',
  DELETE: '已撤销',
  REQUEST_CHANGE: '待改约',
  CHANGE: '已改约',
  SETTLED: '已结算',
};

const DateInfo = props => {
  const { order: o } = props;
  return (
    <Fragment>
      <div>{`${o.item_num}间${o.skus.length}晚`}</div>
      <div>{`入住：${o.departure_time && o.departure_time.substring(0, 10)}`}</div>
      <div>{`离开：${o.return_time && o.return_time.substring(0, 10)}`}</div>
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
              pathname: '/presale/book-detail',
              search: `order_i=${o.i}`,
            }}
          >
            {`预售约: ${o.order_no}`}
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
                  pathname: '/presale/detail',
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
          </Col>
          <Col span={3}>
            <div>
              {o.contacts}
            </div>
            <div>{o.contacts_mobile}</div>
          </Col>
          <Col span={4}>
            <DateInfo order={o} />
          </Col>
          <Col span={3}>
            <div>
              {`金额：￥${o.amount / 100}`}
            </div>
          </Col>
          <Col span={2}>
            <div style={{ textAlign: 'right' }}>
              <Link
                to={{
                  pathname: '/presale/book-detail',
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
          <div>{`备注： ${o.remarks}`}</div>
        </div>
      </div>
    </div>
  );
};

const OrderList = props => (
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

export default OrderList;
export const BookListContent = ListContent;
