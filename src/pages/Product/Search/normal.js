export const normalSearchItems = [
  {
    type: 'text',
    parse: 'like',
    key: 'name',
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
    parse: 'like',
    key: 'product_person_name',
    label: '产品人',
  },
  {
    type: 'text',
    parse: 'like',
    key: 'supplier_name',
    label: '供应商',
  },
  {
    type: 'select',
    parse: 'in',
    key: 'type',
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
    parse: 'in',
    key: 'texture',
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
    parse: 'in',
    key: 'state',
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
    parse: 'in',
    key: 'is_display',
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
