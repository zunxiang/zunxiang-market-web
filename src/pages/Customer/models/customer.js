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
    *find({ payload }, { call, put }) {
      const { currentPage, pageSize, ...pramas } = payload;
      const msg = {
        handler: '/v3/mp/user/user/find',
        message: JSON.stringify({
          ...pramas,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      yield put({
        type: 'findSuccess',
        payload: {
          list: response.list,
          pagination: {
            current: currentPage,
            pageSize,
            total: response.total,
          },
        },
      });
    },
    *changeSalesman({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/user/user/change_salesman',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *giveCoupon({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/user/user/give_coupon',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *open({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/user/user/open',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *close({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/user/user/close',
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
