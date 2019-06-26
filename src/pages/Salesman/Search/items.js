const name = {
  type: 'text',
  parse: 'default',
  key: 'real_name@like',
  label: '姓名',
};

const id = {
  type: 'number',
  parse: 'int',
  key: 'i',
  label: 'ID',
};

const mobile = {
  type: 'text',
  parse: 'default',
  key: 'mobile@like',
  label: '手机号',
};

const state = {
  type: 'select',
  parse: 'default',
  key: 'state@in',
  label: '状态',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '正常',
      value: 1,
    },
    {
      text: '禁用',
      value: 0,
    },
  ],
};

export const SUM = {
  type: 'select',
  parse: 'default',
  key: 'SUM@in',
  label: '数据统计',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '余额',
      value: 'balance',
    },
  ],
};

export const searchItems = [name, id, mobile, state, SUM];
