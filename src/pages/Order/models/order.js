import { GET } from '@/services/api';
import { moneyParser } from '@/utils/parser';
import orderParser from '../parser';

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
      const { currentPage, pageSize, order, sum, ...params } = payload;
      const msg = {
        handler: '/v1/mp/order/mp_order/find',
        message: JSON.stringify({
          query: [params],
          order,
          limit: pageSize,
          sum,
          offset: (currentPage - 1) * pageSize,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const data = {
        list: response.list.map(orderParser),
        sum: {
          amount: moneyParser(response.sum.amount),
          size: response.sum.size,
          totalFee: moneyParser(response.sum.total_fee),
        },
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
      };
      yield put({
        type: 'findSuccess',
        payload: {
          ...data,
        },
      });
      if (callback) callback(data);
    },
    *get({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/get',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const data = orderParser(response);
      if (callback) callback(data);
    },
    *finish({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/finish',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *refund({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/refund',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *getSms({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/get_finish_sms',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *sendSms({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/send_finish_sms',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *findMessage({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/order/mp_order_message/find',
        message: JSON.stringify({
          query: [params],
          order,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *addMessage({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order_message/add',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
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
