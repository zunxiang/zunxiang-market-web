export const normalSearchItems = [
  {
    type: 'text',
    parse: 'default',
    key: 'title@like',
    label: '名称',
  },
  {
    type: 'number',
    parse: 'int',
    key: 'i',
    label: 'ID',
  },
  {
    type: 'select',
    parse: 'array',
    key: 'item_class@in',
    label: '主分类',
    selectMode: 'multiple',
    selectOptions: [
      {
        text: '常规',
        value: 'NORMAL',
      },
      {
        text: '预售',
        value: 'RUSH',
      },
    ],
  },
  {
    type: 'select',
    parse: 'array',
    key: 'type@in',
    label: '子分类',
    selectMode: 'multiple',
    selectOptions: [
      {
        text: '酒店',
        value: 'HTOEL',
      },
      {
        text: '自由行',
        value: 'PKG',
      },
      {
        text: '跟团游',
        value: 'GROUP',
      },
    ],
  },
  {
    type: 'select',
    parse: 'array',
    key: 'state@in',
    label: '状态',
    selectMode: 'multiple',
    selectOptions: [
      {
        text: '出售中',
        value: 1,
      },
      {
        text: '已售罄',
        value: 2,
      },
      {
        text: '已下架',
        value: 0,
      },
    ],
  },
];
