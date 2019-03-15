import React from 'react';
import { List, Tag, Card, Button } from 'antd';
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

const types = {
  HOTEL: '酒店',
  PKG: '自由行',
  GROUP: '跟团',
};

const CoverContent = props => {
  const { item } = props;
  const imgs = item.images && item.images.split(',');
  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 5,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Tag>{types[item.type]}</Tag>
        <Tag color={statusMap[item.state]}>{status[item.state]}</Tag>
      </div>
      <Link
        to={{
          pathname: '/product/normal/detail',
          search: `i=${item.i}`,
        }}
      >
        <img
          alt={item.title}
          src={BaseImgUrl + (item.images ? imgs[0] : 'default.png')}
          style={{ height: 150, width: '100%' }}
        />
      </Link>
    </div>
  );
};

const ListContent = props => {
  const { item, actions } = props;
  return (
    <Card
      className={styles.card}
      hoverable
      cover={<CoverContent {...props} />}
      bodyStyle={{ padding: '10px 5px' }}
      actions={actions(item)}
    >
      <Link
        to={{
          pathname: '/product/normal/detail',
          search: `i=${item.i}`,
        }}
      >
        <Ellipsis lines={1} tooltip className={styles.color59}>
          {item.title}
        </Ellipsis>
      </Link>
    </Card>
  );
};
const ProductList = props => {
  const { item: xitem, actions, onEdit, ...newProps } = props;
  return (
    <List
      {...newProps}
      renderItem={item =>
        item ? (
          <List.Item>
            <ListContent item={item} actions={actions} />
          </List.Item>
        ) : (
          <List.Item>
            <div
              style={{
                height: 225,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Button block type="primary" ghost onClick={() => onEdit('add', 'HOTEL', {})}>
                新建酒店产品
              </Button>
              <Button
                block
                type="primary"
                ghost
                style={{ marginTop: 16 }}
                onClick={() => onEdit('add', 'PKG', {})}
              >
                新建自由行产品
              </Button>
              <Button
                block
                type="primary"
                ghost
                style={{ marginTop: 16 }}
                onClick={() => onEdit('add', 'GROUP', {})}
              >
                新建跟团产品
              </Button>
            </div>
          </List.Item>
        )
      }
    />
  );
};

export default ProductList;
