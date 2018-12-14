import React, { Fragment } from 'react';
import { List, Row, Col, Popover, Icon, Badge, Tag } from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import { payWay } from './payWay';
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
const noticeMap = {
  WAIT: 'default',
  SENT: 'success',
};
const notices = {
  WAIT: '未发通知',
  SENT: '已发通知',
};

const SalesmanInfo = props => {
  const { order: o } = props;
  if (o.salesman_i) {
    return (
      <div>
        <div title={o.salesman_i}>
          <Ellipsis line={1} tooltip>
            {o.salesman_name}
          </Ellipsis>
        </div>
        <div>{`类型: ${o.business}`}</div>
      </div>
    );
  } if (o.franchiser_name) {
    return (
      <div>
        <div title={o.franchiser_i}>
          <Ellipsis line={1} tooltip>
            {o.franchiser_name}
          </Ellipsis>
        </div>
        <div>{`类型：${o.business}`}</div>
      </div>
    );
  } 
    return null;
  
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
          <Icon type="message" className={styles.messageIcon} />
        </Popover>
      ) : (
        ''
      )}
    </div>
  );
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
        </div>
        <div>{`创建时间: ${o.create_time.substring(0, 19)}`}</div>
        <div>
          <Badge status={sourceMap[o.source]} text={sources[o.source]} />
        </div>
        <div>
          <Badge status={noticeMap[o.notice]} text={notices[o.notice]} />
        </div>
        <div>
          <Badge status="success" text={payWay[o.pay_way]} />
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
                  search: `i=${o.rush_i}`,
                }}
              >
                <Ellipsis lines={1} tooltip className={styles.color59}>
                  {`产品: ${o.rush_title}`}
                </Ellipsis>
              </Link>
            </div>

            <div>{`数量：${o.item_num} 份`}</div>
          </Col>
          <Col span={3}>
            <div>
              {o.contacts}
              <span style={{ marginLeft: 8 }}>
                {o.remarks ? (
                  <Popover content={o.remarks} title="备注">
                    <Icon type="message" className={styles.messageIcon} />
                  </Popover>
                ) : (
                  ''
                )}
              </span>
            </div>
            <div>{o.contacts_mobile}</div>
          </Col>
          <Col span={4}>
            <SalesmanInfo order={o} />
          </Col>
          <Col span={3}>
            <div>{`金额：￥${o.amount / 100}`}</div>
            <div>{`佣金：￥${o.commission / 100 || 0}`}</div>
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
          <div>{`团号：${o.team_no}`}</div>
          <div>{`产品人：${o.product_person_name}`}</div>
          <div>{`供应商：${o.supplier_name}`}</div>
          <div>{`创建者：${o.creator_name}`}</div>
          <div>{`最后操作：${o.last_operator_name}`}</div>
          <div>{o.last_edit_time && o.last_edit_time.substring(0, 19)}</div>
          <OperateRemark order={o} />
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
