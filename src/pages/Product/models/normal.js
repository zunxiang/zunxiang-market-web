import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { GET } from '@/services/api';

export default {
  namespace: 'normal',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentItem: {},
  },
  effects: {
    *find({ payload, callback }, { call, put }) {
      const { currentPage, pageSize, ...params } = payload;
      const msg = {
        handler: '/v2/admin/item/main/find',
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
        sum: response.sum,
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
        handler: '/v2/admin/item/main/get_by_i',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *open({ payload, callback }, { call }) {
      const msg = {
        handler: '/v2/admin/item/main/listed',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *close({ payload, callback }, { call }) {
      const msg = {
        handler: '/v2/admin/item/main/close',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *editNormal({ payload }, { put }) {
      yield put({
        type: 'keepCurrent',
        payload: payload.record,
      });
      yield put(routerRedux.push(`/normal/public?${stringify(payload.query)}`));
    },
    *publicAdd({ payload, callback }, { call }) {
      const msg = {
        handler: '/v2/admin/item/main/add',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *publicPost({ payload, callback }, { call }) {
      const msg = {
        handler: '/v2/admin/item/main/post',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *wechatPush({ payload, callback }, { call }) {
      const msg = {
        handler: '/v2/admin/item/main/wx_notice',
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
    operateSuccess(state) {
      return {
        ...state,
      };
    },
    keepCurrent(state, action) {
      return {
        ...state,
        currentItem: action.payload,
      };
    },
  },
};