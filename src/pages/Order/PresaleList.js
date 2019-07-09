import React from 'react';
import { List, Row, Col, Tag, Divider } from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import styles from './NormalList.less';

const statusMap = {
  WAIT: '#bfbfbf',
  SUCCESS: '#52c41a',
  FINISH: '#1890ff',
  CLOSED: '#bfbfbf',
  REFUNDED: '#f5222d',
  SETTLED: '#722ed1',
};
const status = {
  WAIT: '待支付',
  SUCCESS: '已支付',
  FINISH: '已完成',
  CLOSED: '已关闭',
  REFUNDED: '已退款',
  SETTLED: '已结算',
  DELETE: '已撤销',
};

const ListContent = props => {
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
            {`预售订单: ${o.order_no}`}
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
                  pathname: '/product/presale/detail',
                  search: `i=${o.rush_i}`,
                }}
              >
                <Ellipsis lines={1} tooltip className={styles.color59}>
                  {`产品: ${o.item_name}`}
                </Ellipsis>
              </Link>
            </div>
          </Col>
          <Col span={8}>
            <div>
              {`数量：${o.item_num} 份`}
              <Divider type="vertical" />
              {`金额：￥${o.amount / 100}`}
              <Divider type="vertical" />
              {` 佣金：￥${o.commission / 100 || 0}`}
            </div>
          </Col>
          <Col span={6}>
            <div>
              {o.contacts}
              <span style={{ marginLeft: 8 }}>{o.contacts_mobile}</span>
            </div>
          </Col>
          <Col span={2}>
            <div style={{ textAlign: 'right' }}>
              <Link
                to={{
                  pathname: '/presale/order-detail',
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
          <div>{`备注：${o.contact_remarks || '无'}`}</div>
          <div>{`分销：${o.salesman_name || '无'}`}</div>
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
        <ListContent order={item} {...props.handles} />
      </List.Item>
    )}
  />
);

export default OrderList;
export const PresaleListContent = ListContent;
