const createTime = {
  type: 'dateRange',
  parse: 'dateRangeArray',
  key: 'create_time',
  label: '创建时间',
};

const orderNo = {
  type: 'text',
  parse: 'default',
  key: 'order_no@like',
  label: '流水号',
};

const title = {
  type: 'text',
  parse: 'like',
  key: 'title',
  label: '描述',
};

const amountMin = {
  type: 'number',
  parse: 'money',
  key: 'amount@min',
  label: '最小金额',
};

const amountMax = {
  type: 'number',
  parse: 'money',
  key: 'amount@max',
  label: '最大金额',
};

export const searchItems = [orderNo, title, amountMin, amountMax, createTime];
