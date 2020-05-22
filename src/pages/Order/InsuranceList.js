import React, { Fragment } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import { List, Row, Col, Popover, Badge } from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import { payWay } from './payWay';
import styles from './NormalList.less';

const statusMap = {
  WAIT: 'default',
  SUCCESS: 'processing',
  FINISH: 'success',
  CLOSED: 'default',
  REFUNDED: 'default',
  SETTLED: 'success',
};
const status = {
  WAIT: '待支付',
  SUCCESS: '已支付',
  FINISH: '已完成',
  CLOSED: '已关闭',
  REFUNDED: '已退款',
  SETTLED: '已结算',
};
const sourceMap = {
  ONLINE: 'success',
  AGENT: 'processing',
  IMPORT: 'warning',
  GIVEN: 'default',
};
const sources = {
  ONLINE: '在线购买',
  AGENT: '代客下单',
  IMPORT: '后台导入',
  GIVEN: '指定预约',
};

const DateInfo = props => {
  const { order: o } = props;
  return (
    <Fragment>
      <div>{`开始：${o.departure_time && o.departure_time.substring(0, 10)}`}</div>
      <div>{`结束：${o.return_time && o.return_time.substring(0, 10)}`}</div>
    </Fragment>
  );
};

const OperateRemark = props => {
  const { order: o } = props;
  return (
    <div>
      {o.supplier_remarks ||
      o.merchant_remarks ||
      o.finish_remarks ||
      o.cancel_remarks ||
      o.change_remarks ? (
        <Popover
          content={
            <Fragment>
              {o.merchant_remarks ? <p>{`发单备注：${o.merchant_remarks}`}</p> : ''}
              {o.supplier_remarks ? <p>{`供应商备注：${o.supplier_remarks}`}</p> : ''}
              {o.finish_remarks ? <p>{`完成备注：${o.finish_remarks}`}</p> : ''}
              {o.cancel_remarks ? <p>{`拒绝备注：${o.cancel_remarks}`}</p> : ''}
              {o.change_remarks ? <p>{`改期备注：${o.change_remarks}`}</p> : ''}
            </Fragment>
          }
          title="供应商备注"
        >
          操作备注：
          <MessageOutlined className={styles.messageIcon} />
        </Popover>
      ) : (
        ''
      )}
    </div>
  );
};

const MerchantRemark = props => {
  const { order: o } = props;
  if (o.message && o.message.length > 0) {
    return (
      <div>
        <Popover
          content={
            <ul className={styles.messageList}>
              {o.message.map(msg => (
                <li key={msg.time}>{`${msg.time.substring(5, 16)}：${msg.message}`}</li>
              ))}
            </ul>
          }
          title="商家备注"
        >
          商家备注：
          <MessageOutlined className={styles.messageIcon} />
        </Popover>
      </div>
    );
  }
  return null;
};

export const ListContent = props => {
  const { order: o } = props;
  return (
    <div className={styles.orderWrap}>
      <div className={styles.orderHeader}>
        <div>
          <Link
            to={{
              pathname: '/insurance/order-detail',
              search: `order_i=${o.i}`,
            }}
          >
            {`保险订单: ${o.order_no}`}
          </Link>
        </div>
        <div>{`创建时间: ${o.create_time.substring(0, 19)}`}</div>
        <div>
          <Badge status={sourceMap[o.source]} text={sources[o.source]} />
        </div>
        <div>
          <Badge status="success" text={payWay[o.pay_way]} />
        </div>
        <div>
          <Badge status={statusMap[o.state]} text={status[o.state]} />
        </div>
      </div>
      <div className={styles.orderBody}>
        <Row type="flex" justify="space-between" align="middle" gutter={16}>
          <Col span={8}>
            <div>
              <Link
                to={{
                  pathname: '/insurance/list',
                  search: `i=${o.rush_i}`,
                }}
              >
                <Ellipsis lines={1} tooltip className={styles.color59}>
                  {`产品: ${o.item_name}`}
                </Ellipsis>
              </Link>
            </div>
            <div>
              <Ellipsis lines={1} tooltip>
                {`类型: ${o.item_type}`}
              </Ellipsis>
            </div>
          </Col>
          <Col span={3}>
            <div>
              {`${o.contacts}[${o.contacts_id_type}]`}
              <span style={{ marginLeft: 8 }}>
                {o.remarks ? (
                  <Popover content={o.remarks} title="备注">
                    <MessageOutlined className={styles.messageIcon} />
                  </Popover>
                ) : (
                  ''
                )}
              </span>
            </div>
            <div>{o.contacts_id_no}</div>
          </Col>
          <Col span={4}>
            <DateInfo order={o} />
          </Col>
          <Col span={3}>
            <div>{`金额：￥${o.amount / 100}`}</div>
          </Col>
          <Col span={2}>
            <div style={{ textAlign: 'right' }}>
              <Link
                to={{
                  pathname: '/insurance/order-detail',
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
          <div>{`团号：${o.team_no}`}</div>
          <div>{`产品人：${o.product_person_name}`}</div>
          <div>{`供应商：${o.supplier_name}`}</div>
          <div>{`创建者：${o.creator_name}`}</div>
          <div>{`最后操作：${o.last_operator_name}`}</div>
          <div>{o.last_edit_time && o.last_edit_time.substring(0, 19)}</div>
          <OperateRemark order={o} />
          <MerchantRemark order={o} />
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
export const InsuranceListContent = ListContent;
