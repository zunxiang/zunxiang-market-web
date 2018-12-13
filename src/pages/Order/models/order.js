import { notification } from 'antd';
import { GET } from '@/services/api';

export default {
  namespace: 'order',
  state: {
    data: {
      list: [],
      sum: {},
      pagination: {},
    },
    current: {},
    freshtime: null,
  },
  effects: {
    *find({ payload, callback }, { call, put }) {
      const { currentPage, pageSize } = payload;
      const msg = {
        handler: '/v3/merchant/order/order/find',
        message: JSON.stringify({
          ...payload,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
        }),
      };
      const response = yield call(GET, msg);
      if (response[0] === 0) {
        const data = {
          list: response[1].list.map(o => {
            return {
              ...o,
              package: o.package ? JSON.parse(o.package) : {},
            };
          }),
          sum: response[1].sum,
          pagination: {
            current: currentPage,
            pageSize,
            total: response[1].total,
          },
        };
        yield put({
          type: 'findSuccess',
          payload: {
            ...data,
          },
        });
        if (callback) callback(data);
      } else {
        notification.error({
          message: '错误提示',
          description: response[1],
        });
      }
    },
    *get({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/merchant/order/order/get',
        message: JSON.stringify(payload),
      };
      const response = yield call(GET, msg);
      if (response[0] === 0) {
        const data = {
          ...response[1],
          visitors: JSON.parse(response[1].visitors),
        };
        if (callback) callback(data);
      } else {
        notification.error({
          message: '错误提示',
          description: response[1],
        });
      }
    },
    *finishOrder({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/merchant/order/order/settlements',
        message: JSON.stringify(payload),
      };
      const response = yield call(GET, msg);
      if (response[0] === 0) {
        if (callback) callback();
      } else {
        notification.error({
          message: '错误提示',
          description: response[1],
        });
      }
    },
  },

  reducers: {
    findSuccess(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getSuccess(state, action) {
      return {
        ...state,
        currentOrder: action.payload,
      };
    },
    keepCurrent(state, action) {
      return {
        ...state,
        current: { ...action.payload },
      };
    },
    franchiserSuccess(state, action) {
      const { franchisers } = action.payload;
      return {
        ...state,
        franchisers,
      };
    },
    updateFreshtiem(state) {
      return {
        ...state,
        freshtime: new Date().getTime(),
      };
    },
  },
};
