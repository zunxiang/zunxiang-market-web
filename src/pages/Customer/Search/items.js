const nickname = {
  type: 'text',
  parse: 'default',
  key: 'nickname@like',
  label: '昵称',
};

const id = {
  type: 'number',
  parse: 'int',
  key: 'i',
  label: 'ID',
};

const lastLogin = {
  type: 'dateRange',
  parse: 'dateRangeArray',
  key: 'last_login',
  label: '最后登录',
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

const searchItems = [nickname, id, lastLogin, state];

export { searchItems };
