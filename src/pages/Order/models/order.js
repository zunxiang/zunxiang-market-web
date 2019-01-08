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
      const { currentPage, pageSize, ...pramas } = payload;
      const msg = {
        handler: '/v1/mp/order/user_order/find',
        message: JSON.stringify({
          ...pramas,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const data = {
        list: response.list.map(o => ({
          ...o,
          package: o.package ? JSON.parse(o.package) : {},
        })),
        sum: response.sum,
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
        handler: '/v1/mp/order/user_order/get',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const data = {
        ...response,
        visitors: JSON.parse(response.visitors),
      };
      if (callback) callback(data);
    },
    *finishOrder({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/user_order/settlements',
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
