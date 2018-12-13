export const normalSearchItems = [
  {
    type: 'text',
    parse: 'default',
    key: 'name@like',
    label: '名称',
  },
  {
    type: 'number',
    parse: 'int',
    key: 'i',
    label: 'ID',
  },
  {
    type: 'text',
    parse: 'default',
    key: 'product_person_name@like',
    label: '产品人',
  },
  {
    type: 'text',
    parse: 'default',
    key: 'supplier_name@like',
    label: '供应商',
  },
  {
    type: 'select',
    parse: 'array',
    key: 'type@in',
    label: '分类',
    selectMode: 'multiple',
    selectOptions: [
      {
        text: '酒店',
        value: '酒店',
      },
      {
        text: '周边游',
        value: '周边游',
      },
      {
        text: '出境游',
        value: '出境游',
      },
    ],
  },
  {
    type: 'select',
    parse: 'array',
    key: 'texture@in',
    label: '类别',
    selectMode: 'multiple',
    selectOptions: [
      {
        text: '酒店',
        value: 'HOTEL',
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
  {
    type: 'select',
    parse: 'array',
    key: 'is_display@in',
    label: '商城展示',
    selectMode: 'multiple',
    selectOptions: [
      {
        text: '展示',
        value: 'TRUE',
      },
      {
        text: '不展示',
        value: 'FALSE',
      },
    ],
  },
];
