import { GET, POST } from '@/services/api';

export default {
  namespace: 'pack',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    skus: {},
  },
  effects: {
    *find({ payload, callback }, { call, put }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/item/package/find',
        message: JSON.stringify({
          query: [{ ...params }],
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
      yield put({
        type: 'findSuccess',
        payload: {
          ...data,
        },
      });
      if (callback) callback(data);
    },
    *findSku({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/item/sku/find',
        message: JSON.stringify({
          query: [{ ...params }],
          order,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response.list);
    },
    *dragSorting({ payload, callback }, { put }) {
      yield put({
        type: 'updateList',
        payload,
      });
      if (callback) callback();
    },
    *postSorting({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/package/post',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(POST, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *delete({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/package/delete',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/package/add',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(POST, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *post({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/package/post',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(POST, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *clearSkus(_, { put }) {
      yield put({
        type: 'findSkuSuccess',
        payload: {
          list: [],
        },
      });
    },
    *skusPost({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/sku/set_skus',
        message: JSON.stringify(payload),
      };
      const [code, data] = yield call(POST, msg);
      if (code !== 0) return;
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
    findSkuSuccess(state, action) {
      const { list } = action.payload;
      const len = list.length;
      const skus = {};
      for (let i = 0; i < len; i += 1) {
        skus[list[i].date.substring(0, 10)] = list[i];
      }
      return {
        ...state,
        skus,
      };
    },
    updateList(state, action) {
      const {
        payload: { list },
      } = action;
      const data = { ...state.data, list };
      return {
        ...state,
        data,
      };
    },
  },
};
