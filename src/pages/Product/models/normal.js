import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { GET, POST } from '@/services/api';

export default {
  namespace: 'normal',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    current: {},
  },
  effects: {
    *find({ payload, callback }, { call, put }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/item/item/find',
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
        handler: '/v1/mp/item/item/get',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *getContent({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/get_rich_text_content',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *open({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/listed',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *close({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/close',
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
      yield put(routerRedux.push(`/product/normal/create?${stringify(payload.query)}`));
    },
    *publicAdd({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/add',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(POST, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *publicPost({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/post',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(POST, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *wechatPush({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/wx_notice',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *subscript({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/book_order_notice',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *unsubscript({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/unbook_order_notice',
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
        current: action.payload,
      };
    },
  },
};
