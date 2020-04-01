import React from 'react';
import { List, Tag, Card } from 'antd';
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
  NORMAL_HOTEL: '常规酒店',
  NORMAL_PKG: '常规自由行',
  NORMAL_GROUP: '常规跟团',
  NORMAL_GOODS: '实体产品',
  RUSH_HOTEL: '预售酒店',
  RUSH_PKG: '预售自由行',
  RUSH_GROUP: '预售跟团',
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
        <Tag>{types[`${item.item_class}_${item.type}`]}</Tag>
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
          {`[id:${item.i}] ${item.title}`}
        </Ellipsis>
      </Link>
    </Card>
  );
};
const ProductList = props => {
  const { item: xitem, actions, ...newProps } = props;
  return (
    <List
      {...newProps}
      grid={{ gutter: 32, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }}
      renderItem={item => (
        <List.Item style={{ height: 256 }} key={item.i}>
          <ListContent item={item} actions={actions} />
        </List.Item>
      )}
    />
  );
};

export default ProductList;
