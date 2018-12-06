import React from 'react';
import { List, Row, Col, Tag } from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import { BaseImgUrl } from '@/common/config';

import styles from './style.less';

const statusMap = {
  BEFORE: '#13c2c2',
  ING: '#52c41a',
  AFTER: '#1890ff',
  CLOSE: '#bfbfbf',
  DELETE: '#bfbfbf',
};
const status = {
  BEFORE: '未开始',
  ING: '进行中',
  AFTER: '已结束',
  CLOSE: '已关闭',
  DELETE: '已删除',
};

const PresaleListContent = props => {
  const { item } = props;
  const imgs = item.images.split(',');
  return (
    <div className={styles.wrap}>
      <div className={styles.contentLeft}>
        <img src={BaseImgUrl + (item.images ? imgs[0] : 'default.png')} alt="产品图片" />
      </div>
      <div className={styles.contentCenter}>
        <Row type="flex" justify="space-between" align="middle" gutter={16}>
          <Col span={7}>
            <div>
              <Link
                to={{
                  pathname: '/product/presale/detail',
                  search: `i=${item.i}`,
                }}
              >
                <Ellipsis lines={2} tooltip className={styles.color59}>
                  {item.title}
                </Ellipsis>
              </Link>
            </div>
          </Col>
          <Col span={14}>
            <div className={styles.detailContainer}>
              <span className={styles.detailContent}>id：{item.i}</span>
              <span className={styles.detailContent}>价格：{item.price / 100}</span>
              <span className={styles.detailContent}>佣金：{item.commission / 100}</span>
              <span className={styles.detailContent}>销量：{item.sales}</span>
              <span className={styles.detailContent}>
                {item.pay_way === 'offline' ? '到店补差' : '在线补差'}
              </span>
              <span className={styles.detailContent}>
                {item.create_ecode === 'true' ? '发码' : '不发码'}
              </span>
            </div>
            <div className={styles.detailContainer}>
              <span className={styles.detailContent}>产品人: {item.product_person_name}</span>
              <span className={styles.detailContent}>供应商: {item.supplier_name}</span>
              <span className={styles.detailContent}>商家: {item.merchant_i}</span>
            </div>
            <div className={styles.detailContainer}>
              <span className={styles.detailContent}>
                出售: {item.rush_begin_time.substring(2, 10)}~{item.rush_end_time.substring(2, 10)}
              </span>
              <span className={styles.detailContent}>
                使用: {item.use_begin_time.substring(2, 10)}~{item.use_end_time.substring(2, 10)}
              </span>
              <span className={styles.detailContent}>
                发码: {item.send_code_time.substring(2, 10)}
              </span>
            </div>
          </Col>
          <Col span={3}>
            <div>
              <Tag color={statusMap[item.state]}>{status[item.state]}</Tag>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.contentRight}>{props.operates ? props.operates(item) : null}</div>
    </div>
  );
};
const ProductList = props => {
  const newProps = { ...props };
  delete newProps.item;
  delete newProps.operates;
  return (
    <List
      {...newProps}
      className={styles.listContainer}
      renderItem={item => (
        <List.Item>
          <PresaleListContent item={item} operates={props.operates} />
        </List.Item>
      )}
    />
  );
};

export default ProductList;
