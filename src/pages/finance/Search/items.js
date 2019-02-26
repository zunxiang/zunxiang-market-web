const createTime = {
  type: 'dateRange',
  parse: 'dateRange',
  key: 'create_time',
  label: '创建时间',
};

const orderNo = {
  type: 'text',
  parse: 'like',
  key: 'order_no',
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
