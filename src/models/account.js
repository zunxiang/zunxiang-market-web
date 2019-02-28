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
    *find({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/app_account/account/find',
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
        list: response.list.map(val => ({
          ...val,
          last_login_time: val.last_login_time && val.last_login_time.substring(0, 19),
        })),
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
      };
      if (callback) callback(data);
    },
    *getAllPower({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/app_account/account/all_power',
        message: JSON.stringify(payload),
      };
      const [code, data] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(data);
    },
    *add({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/app_account/account/add',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *edit({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/app_account/account/post',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *unbind({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/app_account/account/unbind_weixin',
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
