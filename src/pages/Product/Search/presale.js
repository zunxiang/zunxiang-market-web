export const preasleSearchItems = [
  {
    type: 'text',
    parse: 'like',
    key: 'title',
    label: '名称',
  },
  {
    type: 'text',
    parse: 'default',
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
    type: 'numebr',
    parse: 'int',
    key: 'supplier_name',
    label: '供应商',
  },
  {
    type: 'select',
    parse: 'in',
    key: 'state',
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
