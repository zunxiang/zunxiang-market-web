const name = {
  type: 'text',
  parse: 'like',
  key: 'bankman',
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
  parse: 'like',
  key: 'mobile',
  label: '手机号',
};

const shopName = {
  type: 'text',
  parse: 'like',
  key: 'shopname',
  label: '店铺名',
};

const state = {
  type: 'select',
  parse: 'in',
  key: 'defray_state',
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
  parse: 'array',
  key: 'SUM',
  label: '数据统计',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '余额',
      value: 'balance',
    },
    {
      text: '总业绩',
      value: 'achievement',
    },
  ],
};

export const searchItems = [name, id, mobile, shopName, state, SUM];
