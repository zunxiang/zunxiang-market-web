import React from 'react';
import { List, Row, Col, Tag } from 'antd';
import { Link } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import { BaseImgUrl } from '@/common/config';

import styles from './style.less';

const statusMap = {
  0: '#bfbfbf',
  1: '#52c41a',
  2: '#faad14',
};
const status = {
  0: '已下架',
  1: '出售中',
  2: '已售罄',
};

const getItemType = item => {
  if (item.texture === 'GROUP') {
    return item.type === '出境游' ? '出境跟团游' : '周边跟团游';
  } else if (item.texture === 'HOTEL') {
    return '酒店';
  } else {
    return item.type === '出境游' ? '出境自由行' : '周边自由行';
  }
};

const PresaleListContent = props => {
  const { item } = props;
  const imgs = item.images && item.images.split(',');
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
                  pathname: '/normal/detail',
                  search: `i=${item.i}`,
                }}
              >
                <Ellipsis lines={2} tooltip className={styles.color59}>
                  {item.name}
                </Ellipsis>
              </Link>
            </div>
          </Col>
          <Col span={14}>
            <div className={styles.detailContainer}>
              <span className={styles.detailContent}>id：{item.i}</span>
              <span className={styles.detailContent}>分类：{getItemType(item)}</span>
              <span className={styles.detailContent}>销量：{item.sales}</span>
              <span className={styles.detailContent}>
                商城：{item.is_display === 'TRUE' ? 'yes' : 'no'}
              </span>
            </div>
            <div className={styles.detailContainer}>
              <span className={styles.detailContent}>产品人: {item.product_person_name}</span>
              <span className={styles.detailContent}>供应商: {item.supplier_name}</span>
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
