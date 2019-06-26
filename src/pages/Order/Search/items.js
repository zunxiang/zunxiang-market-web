export const orderNo = {
  type: 'text',
  parse: 'default',
  key: 'order_no@like',
  label: '订单号',
};

export const itemName = {
  type: 'text',
  parse: 'default',
  key: 'item_title@like',
  label: '产品名',
};

export const rushTitle = {
  type: 'text',
  parse: 'default',
  key: 'rush_title@linke',
  label: '产品名',
};

export const productPersonName = {
  type: 'text',
  parse: 'default',
  key: 'product_person_name@like',
  label: '产品人',
};

export const teamNo = {
  type: 'text',
  parse: 'default',
  key: 'team_no@like',
  label: '关联单号',
};

export const supplierName = {
  type: 'text',
  parse: 'default',
  key: 'supplier_name@like',
  label: '供应商',
};

export const creatorName = {
  type: 'text',
  parse: 'default',
  key: 'creator_name@like',
  label: '创建人',
};

export const salesmanName = {
  type: 'text',
  parse: 'default',
  key: 'salesman_name@like',
  label: '分销名',
};

export const franchiserName = {
  type: 'text',
  parse: 'default',
  key: 'franchiser_name@like',
  label: '内部分销',
};

export const franchiserCity = {
  type: 'text',
  parse: 'default',
  key: 'franchiser_city@like',
  label: '分销城市',
};

export const franchsierManagerName = {
  type: 'text',
  parse: 'default',
  key: 'franchiser_manager_name@like',
  label: '销售经理',
};

export const franchiserSettlementCycle = {
  type: 'select',
  parse: 'default',
  key: 'franchiser_settlement_cycle@in',
  label: '结算周期',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '单结',
      value: 0,
    },
    {
      text: '周结',
      value: 7,
    },
    {
      text: '半月结',
      value: 15,
    },
    {
      text: '月结',
      value: 30,
    },
  ],
};

export const contacts = {
  type: 'text',
  parse: 'default',
  key: 'contacts@like',
  label: '联系人',
};

export const contactsMobile = {
  type: 'text',
  parse: 'defualt',
  key: 'contacts_mobile@like',
  label: '手机号',
};

export const orderMobile = {
  type: 'text',
  parse: 'default',
  key: 'order_mobile@like',
  label: '登录账号',
};

export const amountMin = {
  type: 'number',
  parse: 'money',
  key: 'amount@min',
  label: '最小金额',
};

export const amountMax = {
  type: 'number',
  parse: 'money',
  key: 'amount@max',
  label: '最大金额',
};

export const commissionMin = {
  type: 'number',
  parse: 'money',
  key: 'fee@min',
  label: '最小佣金',
};

export const commissionMax = {
  type: 'number',
  parse: 'money',
  key: 'fee@max',
  label: '最大佣金',
};

export const skus = {
  type: 'date',
  parse: 'dateLike',
  key: 'skus',
  label: '入住日期',
};

export const createTime = {
  type: 'dateRange',
  parse: 'dateRange',
  key: 'create_time',
  label: '下单时间',
};

export const payTime = {
  type: 'dateRange',
  parse: 'dateRange',
  key: 'pay_time',
  label: '付款时间',
};

export const departureTime = {
  type: 'dateRange',
  parse: 'dateRange',
  key: 'departure_time',
  label: '出行时间',
};

export const receiptState = {
  type: 'select',
  parse: 'default',
  key: 'receipt_state@in',
  label: '收款状态',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '未收款',
      value: 'NOT',
    },
    {
      text: '部分收款',
      value: 'PART',
    },
    {
      text: '已收全',
      value: 'ALL',
    },
  ],
};

export const defrayState = {
  type: 'select',
  parse: 'default',
  key: 'defray_state@in',
  label: '付款状态',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '未付款',
      value: 'NOT',
    },
    {
      text: '部分付款',
      value: 'PART',
    },
    {
      text: '已付清',
      value: 'ALL',
    },
  ],
};

export const refundState = {
  type: 'select',
  parse: 'default',
  key: 'refund_state@in',
  label: '退款状态',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '无退款',
      value: 'NOT',
    },
    {
      text: '部分退款',
      value: 'PART',
    },
    {
      text: '已全退',
      value: 'ALL',
    },
  ],
};

export const supplierButtMode = {
  type: 'select',
  parse: 'default',
  key: 'supplier_butt_mode@in',
  label: '发单方式',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '系统发单',
      value: 'EBOOKING',
    },
    {
      text: '电子邮件',
      value: 'EMAIL',
    },
    {
      text: '线下发单',
      value: 'OFFLINE',
    },
  ],
};

export const source = {
  type: 'select',
  parse: 'default',
  key: 'source@in',
  label: '订单来源',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '在线购买',
      value: 'ONLINE',
    },
    {
      text: '代客下单',
      value: 'AGENT',
    },
    {
      text: '后台导入',
      value: 'IMPORT',
    },
  ],
};
export const itemClass = {
  type: 'select',
  parse: 'default',
  key: 'item_class@in',
  label: '产品主类',
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
};
export const itemType = {
  type: 'select',
  parse: 'default',
  key: 'item_type@in',
  label: '产品子类',
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
};

export const notice = {
  type: 'select',
  parse: 'in',
  key: 'notice',
  label: '通知状态',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '未发',
      value: 'WAIT',
    },
    {
      text: '已发',
      value: 'SENT',
    },
  ],
};

export const state = {
  type: 'select',
  parse: 'default',
  key: 'state@in',
  label: '订单状态',
  selectMode: 'multiple',
  selectOptions: [
    {
      value: 0,
      text: '已关闭',
    },
    {
      value: 1,
      text: '待支付',
    },
    {
      value: 2,
      text: '已支付',
    },
    {
      value: 3,
      text: '已确认',
    },
    {
      value: 4,
      text: '退款中',
    },
    {
      value: 5,
      text: '已退款',
    },
    {
      value: '-1',
      text: '已删除',
    },
  ],
};

export const payWay = {
  type: 'select',
  parse: 'default',
  key: 'pay_way@in',
  label: '支付方式',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '微信支付',
      value: 'WXPAY',
    },
    {
      text: '授信支付',
      value: 'CREDIT',
    },
  ],
};

export const payerI = {
  type: 'number',
  parse: 'int',
  key: 'payer_i',
  label: '用户ID',
};

export const itemI = {
  type: 'number',
  parse: 'int',
  key: 'item_i',
  label: '产品ID',
};

export const rushI = {
  type: 'number',
  parse: 'int',
  key: 'rush_i',
  label: '预售ID',
};

export const SUM = {
  type: 'select',
  parse: 'array',
  key: 'SUM',
  label: '数据统计',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '总销量',
      value: 'size',
    },
    {
      text: '总金额',
      value: 'amount',
    },
    {
      text: '总返佣',
      value: 'commission',
    },
    {
      text: '总应收',
      value: 'actual_amount',
    },
    {
      text: '总已收',
      value: 'paid_amount',
    },
    {
      text: '总应付',
      value: 'actual_cost',
    },
    {
      text: '总已付',
      value: 'paid_cost',
    },
    {
      text: '总退款',
      value: 'paid_refund',
    },
    {
      text: '总借款',
      value: 'paid_borrow',
    },
    {
      text: '总报销',
      value: 'paid_expense',
    },
    {
      text: '总收票',
      value: 'paid_supplier_invoice',
    },
    {
      text: '总开票',
      value: 'paid_merchant_invoice',
    },
    {
      text: '总利润',
      value: 'profit',
    },
  ],
};
