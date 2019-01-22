import { GET } from '@/services/api';

export default {
  namespace: 'customer',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *find({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/user/user/find',
        message: JSON.stringify({
          query: [params],
          order,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const data = {
        list: response.list,
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
      };
      if (callback) callback(data);
    },
    *changeSalesman({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/user/change_salesman',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *giveCoupon({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/user/give_coupon',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *open({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/user/open',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *close({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/user/close',
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
  },
};
