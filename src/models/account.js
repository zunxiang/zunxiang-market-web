import { notification } from 'antd';
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
        handler: '/v2/admin/super/find',
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
    *add({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/super/add',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *edit({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/super/post',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *open({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/super/open',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *close({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/super/close',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
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
