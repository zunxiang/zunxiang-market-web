import { GET } from '@/services/adminApi';
/* eslint-disable */
import secureCipher from 'secure';

export default {
  namespace: 'adminWemall',
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
        handler: '/v1/admin/app/app/find',
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
        handler: '/v1/admin/app/app/all_power',
        message: JSON.stringify(payload),
      };
      const [code, data] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(data);
    },
    *add({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/admin/app/app/add',
        message: JSON.stringify(secureCipher(JSON.stringify(payload))),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *edit({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/admin/app/app/post',
        message: JSON.stringify(secureCipher(JSON.stringify(payload))),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *findAccount({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/admin/app/account/find',
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
