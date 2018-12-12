import { GET } from '@/services/api';

export default {
  namespace: 'account',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *find({ payload, callback }, { call, put }) {
      const { currentPage, pageSize, ...params } = payload;
      const msg = {
        handler: '/v3/mp/app_account/account/find',
        message: JSON.stringify({
          ...params,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
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
      yield put({
        type: 'findSuccess',
        payload: { ...data },
      });
      if (callback) callback(data);
    },
    *getAllPower({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/app_account/account/all_power',
        message: JSON.stringify(payload),
      };
      const [code, data] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(data);
    },
    *add({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/app_account/account/add',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *edit({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/app_account/account/post',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
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
