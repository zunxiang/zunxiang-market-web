import React from 'react';
import { List } from 'antd';
import { PresaleListContent } from './PresaleList';
import { BookListContent } from './BookList';
import { InsuranceListContent } from './InsuranceList';
import { NormalListContent } from './NormalList';

import styles from './NormalList.less';

const ListContent = props => {
  const { order } = props;
  if (order.item_type === 'RUSH') {
    return <PresaleListContent order={order} />;
  }
  if (order.item_type === 'RUSH_BOOK' || order.item_type === 'BOOK') {
    return <BookListContent order={order} />;
  }
  if (order.item_type === 'INSURANCE') {
    return <InsuranceListContent order={order} />;
  }
  if (order.item_type === 'ITEM') {
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
