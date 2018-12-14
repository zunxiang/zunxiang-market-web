import React, { Fragment } from 'react';
import { List, Row, Col, Popover, Icon, Badge, Tag } from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import { payWay } from './payWay';
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
const sourceMap = {
  ONLINE: 'success',
  AGENT: 'processing',
  IMPORT: 'warning',
};
const sources = {
  ONLINE: '在线购买',
  AGENT: '代客下单',
  IMPORT: '后台导入',
};
const buttModes = {
  EBOOKING: '系统发单',
  EMAIL: '电子邮件',
  OFFLINE: '线下发单',
};
const buttModeMap = {
  EBOOKING: 'success',
  EMAIL: 'warning',
  OFFLINE: 'processing',
};

const noticeMap = {
  WAIT: 'default',
  SENT: 'success',
};
const notices = {
  WAIT: '未发短信',
  SENT: '已发短信',
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
        <div>
          类型:
          {o.business}
        </div>
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
        <div>
          类型：
          {o.business}
        </div>
      </div>
    );
  } 
    return null;
  
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
  } if (o.item_texture === 'GROUP') {
    return (
      <Fragment>
        <div>
          <span style={{ marginRight: 8 }}>{`${o.adult_num}大${o.child_num}小`}</span>
        </div>
        <div>{`${o.departure_time.substring(0, 10)}`}</div>
      </Fragment>
    );
  } 
    return (
      <Fragment>
        <div>{`${o.item_num}份`}</div>
        <div>{`${o.departure_time && o.departure_time.substring(0, 10)}`}</div>
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
              {o.merchant_remarks ? (
                <p>
                  发单备注：
                  {o.merchant_remarks}
                </p>
              ) : (
                ''
              )}
              {o.supplier_remarks ? (
                <p>
                  供应商备注：
                  {o.supplier_remarks}
                </p>
              ) : (
                ''
              )}
              {o.finish_remarks ? (
                <p>
                  完成备注：
                  {o.finish_remarks}
                </p>
              ) : (
                ''
              )}
              {o.cancel_remarks ? (
                <p>
                  拒绝备注：
                  {o.cancel_remarks}
                </p>
              ) : (
                ''
              )}
              {o.change_remarks ? (
                <p>
                  改期备注：
                  {o.change_remarks}
                </p>
              ) : (
                ''
              )}
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

export const ListContent = props => {
  const { order: o } = props;
  return (
    <div className={styles.orderWrap}>
      <div className={styles.orderHeader}>
        <div>
          <Link
            to={{
              pathname: '/normal/order-detail',
              search: `order_i=${o.i}`,
            }}
          >
            常规订单: {o.order_no}
          </Link>
        </div>
        <div>创建时间: {o.create_time.substring(0, 19)}</div>
        <div>
          <Badge status={sourceMap[o.source]} text={sources[o.source]} />
        </div>
        <div>
          <Badge
            status={buttModeMap[o.supplier_butt_mode]}
            text={buttModes[o.supplier_butt_mode]}
          />
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
                {`套餐: ${o.package.name}`}
              </Ellipsis>
            </div>
            {o.item_texture === 'HOTEL' ? (
              <div>
                {o.package.room}
                <span style={{ marginLeft: 12 }}>{o.package.content}</span>
              </div>
            ) : null}
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
            <DateInfo order={o} />
          </Col>
          <Col span={4}>
            <SalesmanInfo order={o} />
          </Col>
          <Col span={3}>
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
          <div>
            团号：
            {o.team_no}
          </div>
          <div>{`产品人：${o.product_person_name}`}</div>
          <div>{`供应商：${o.supplier_name}`}</div>
          <div>
            创建者：
            {o.creator_name}
          </div>
          <div>
            最后操作：
            {o.last_operator_name}
          </div>
          <div>{o.last_edit_time && o.last_edit_time.substring(0, 19)}</div>
          <OperateRemark order={o} />
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
