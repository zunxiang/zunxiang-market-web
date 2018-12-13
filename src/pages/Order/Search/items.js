export const orderNo = {
  type: 'text',
  parse: 'like',
  key: 'order_no',
  label: '订单号',
};

export const itemName = {
  type: 'text',
  parse: 'like',
  key: 'item_name',
  label: '产品名',
};

export const rushTitle = {
  type: 'text',
  parse: 'like',
  key: 'rush_title',
  label: '产品名',
};

export const productPersonName = {
  type: 'text',
  parse: 'like',
  key: 'product_person_name',
  label: '产品人',
};

export const teamNo = {
  type: 'text',
  parse: 'like',
  key: 'team_no',
  label: '关联单号',
};

export const supplierName = {
  type: 'text',
  parse: 'like',
  key: 'supplier_name',
  label: '供应商',
};

export const creatorName = {
  type: 'text',
  parse: 'like',
  key: 'creator_name',
  label: '创建人',
};

export const salesmanName = {
  type: 'text',
  parse: 'like',
  key: 'salesman_name',
  label: '平台分销',
};

export const franchiserName = {
  type: 'text',
  parse: 'like',
  key: 'franchiser_name',
  label: '内部分销',
};

export const franchiserCity = {
  type: 'text',
  parse: 'like',
  key: 'franchiser_city',
  label: '分销城市',
};

export const franchsierManagerName = {
  type: 'text',
  parse: 'like',
  key: 'franchiser_manager_name',
  label: '销售经理',
};

export const franchiserSettlementCycle = {
  type: 'select',
  parse: 'in',
  key: 'franchiser_settlement_cycle',
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
  parse: 'like',
  key: 'contacts',
  label: '联系人',
};

export const contactsMobile = {
  type: 'text',
  parse: 'like',
  key: 'contacts_mobile',
  label: '手机号',
};

export const orderMobile = {
  type: 'text',
  parse: 'like',
  key: 'order_mobile',
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
  key: 'commission@min',
  label: '最小佣金',
};

export const commissionMax = {
  type: 'number',
  parse: 'money',
  key: 'commission@max',
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
  parse: 'in',
  key: 'receipt_state',
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
  parse: 'in',
  key: 'defray_state',
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
  parse: 'in',
  key: 'refund_state',
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
  parse: 'in',
  key: 'supplier_butt_mode',
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
  parse: 'in',
  key: 'source',
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

export const orderType = {
  type: 'select',
  parse: 'in',
  key: 'order_type',
  label: '订单类型',
  selectMode: 'multiple',
  selectOptions: [
    {
      text: '常规订单',
      value: 'ITEM',
    },
    {
      text: '预售订单',
      value: 'RUSH',
    },
    {
      text: '预约订单',
      value: 'RUSH_BOOK',
    },
    {
      text: '保险订单',
      value: 'INSURANCE',
    },
  ],
};

export const itemTexture = {
  type: 'select',
  parse: 'in',
  key: 'item_texture',
  label: '产品类型',
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
  parse: 'in',
  key: 'state',
  label: '订单状态',
  selectMode: 'multiple',
  selectOptions: [
    {
      value: 'WAIT',
      text: '待支付',
    },
    {
      value: 'SUCCESS',
      text: '已支付',
    },
    {
      value: 'EDITED',
      text: '已编辑',
    },
    {
      value: 'CANCEL',
      text: '已拒绝',
    },
    {
      value: 'HANDLING',
      text: '待确定',
    },
    {
      value: 'FINISH',
      text: '已确认',
    },
    {
      value: 'REQUEST_DELETE',
      text: '待撤销',
    },
    {
      value: 'DELETE',
      text: '已撤销',
    },
    {
      value: 'REQUEST_CHANGE',
      text: '待改约',
    },
    {
      value: 'CHANGE',
      text: '已改约',
    },
    {
      value: 'SETTLED',
      text: '已结算',
    },
    {
      value: 'CLOSED',
      text: '已关闭',
    },
  ],
};

export const payWay = {
  type: 'select',
  parse: 'in',
  key: 'pay_way',
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