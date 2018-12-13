import React from 'react';
import { List } from 'antd';
import { PresaleListContent } from './PresaleList';
import { BookListContent } from './BookList';
import { InsuranceListContent } from './InsuranceList';
import { NormalListContent } from './NormalList';

import styles from './NormalList.less';

const ListContent = props => {
  const { order } = props;
  if (order.order_type === 'RUSH') {
    return <PresaleListContent order={order} />;
  } else if (order.order_type === 'RUSH_BOOK' || order.order_type === 'BOOK') {
    return <BookListContent order={order} />;
  } else if (order.order_type === 'INSURANCE') {
    return <InsuranceListContent order={order} />;
  } else if (order.order_type === 'ITEM') {
    return <NormalListContent order={order} />;
  } else {
    return null;
  }
};
const AllList = props => {
  return (
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
};

export default AllList;
