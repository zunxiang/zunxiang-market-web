import React from 'react';
import { List } from 'antd';
import { PresaleListContent } from './PresaleList';
import { BookListContent } from './BookList';
import { NormalListContent } from './NormalList';

import styles from './NormalList.less';

const normalTypes = ['HOTEL', 'GROUP', 'PKG', 'GOODS'];

const ListContent = props => {
  const { order } = props;
  if (order.item_type === 'RUSH') {
    return <PresaleListContent order={order} />;
  }
  if (order.item_type === 'RUSH_BOOK' || order.order_type === 'BOOK') {
    return <BookListContent order={order} />;
  }
  if (normalTypes.includes(order.item_type)) {
    return <NormalListContent order={order} />;
  }
  return null;
};
const AllList = props => (
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

export default AllList;
