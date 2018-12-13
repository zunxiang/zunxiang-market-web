export const preasleSearchItems = [
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
    key: 'state@in',
    label: '状态',
    selectMode: 'multiple',
    selectOptions: [
      {
        text: '未开始',
        value: 'BEFORE',
      },
      {
        text: '进行中',
        value: 'ING',
      },
      {
        text: '已结束',
        value: 'AFTER',
      },
      {
        text: '已关闭',
        value: 'CLOSE',
      },
      {
        text: '已删除',
        value: 'DELETE',
      },
    ],
  },
];
