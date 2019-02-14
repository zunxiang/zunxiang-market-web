import React, { Fragment } from 'react';
import { List, Row, Col, Tag } from 'antd';
import { Link } from 'dva/router';
import { orderType, orderStatus, orderStatusMap } from './common';
import Ellipsis from '@/components/Ellipsis';
import styles from './NormalList.less';

const DateInfo = props => {
  const { order: o } = props;
  if (o.item_type === 'HOTEL') {
    return (
      <Fragment>
        <div>{`${o.item_num}间${o.skus.length}晚`}</div>
        <div>{`入住：${o.start_time.substring(0, 10)}`}</div>
        <div>{`离开：${o.end_time.substring(0, 10)}`}</div>
      </Fragment>
    );
  }
  if (o.item_type === 'GROUP') {
    return (
      <Fragment>
        <div>
          <span style={{ marginRight: 8 }}>{`${o.adult_num}大${o.child_num}小`}</span>
        </div>
        <div>{`日期：${o.start_time.substring(0, 10)}`}</div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <div>{`数量：${o.item_num}份`}</div>
      <div>{`日期：${o.start_time && o.start_time.substring(0, 10)}`}</div>
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
              pathname: '/order/detail',
              search: `order_i=${o.i}`,
            }}
          >
            {`单号: ${o.order_no}`}
          </Link>
          <span className={styles.marginLeft32}>
            {`创建时间: ${o.create_time.substring(0, 19)}`}
          </span>
          <span className={styles.marginLeft32}>{`类型：${orderType[o.item_type]}`}</span>
        </div>
        <div>
          <Tag color={orderStatusMap[o.state]}>{orderStatus[o.state]}</Tag>
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
                  {`产品: ${o.item_title}`}
                </Ellipsis>
              </Link>
            </div>
            <div>
              <Ellipsis lines={1} tooltip>
                {`套餐: ${o.package_name}`}
              </Ellipsis>
            </div>
            {o.item_type === 'HOTEL' ? (
              <div>
                {o.package.room}
                <span style={{ marginLeft: 12 }}>{o.package.content}</span>
              </div>
            ) : null}
          </Col>
          <Col span={4}>
            <div>{o.contacts}</div>
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
                  pathname: '/order/detail',
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
