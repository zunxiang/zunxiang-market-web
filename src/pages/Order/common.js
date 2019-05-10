export const userStatus = {};
export const supplierStatus = {};

export const orderType = {
  RUSH_HOTEL: '预售订单',
  RUSH_PKG: '预售订单',
  RUSH_GROUP: '预售订单',
  RUSH_BOOK: '预约订单',
  NORMAL_HOTEL: '酒店订单',
  NORMAL_GROUP: '跟团订单',
  NORMAL_PKG: '自由行订单',
};

export const orderStatusMap = {
  '-1': '#bfbfbf',
  0: '#bfbfbf',
  1: '#bfbfbf',
  2: '#52c41a',
  3: '#1890ff',
  4: '#13c2c2',
  5: '#bfbfbf',
};
export const orderStatus = {
  '-1': '已删除',
  0: '已关闭',
  1: '待支付',
  2: '已支付',
  3: '已确认',
  4: '退款中',
  5: '已退款',
};
