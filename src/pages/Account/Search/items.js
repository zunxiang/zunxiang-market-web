const name = {
  type: 'text',
  parse: 'like',
  key: 'name',
  label: '姓名',
};

const id = {
  type: 'number',
  parse: 'int',
  key: 'i',
  label: 'ID',
};

const userName = {
  type: 'text',
  parse: 'like',
  key: 'userName',
  label: '用户名',
};

const mobile = {
  type: 'text',
  parse: 'like',
  key: 'mobile',
  label: '手机号',
};

const lastLogin = {
  type: 'dateRange',
  parse: 'dateRangeArray',
  key: 'last_login',
  label: '最后登录',
};

export const searchItems = [name, id, userName, mobile, lastLogin];
