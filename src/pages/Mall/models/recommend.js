import { GET } from '@/services/api';

export default {
  namespace: 'recommend',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *find({ payload }, { call, put }) {
      const { currentPage, pageSize, ...params } = payload;
      const msg = {
        handler: '/v3/mp/option/xstj/find',
        message: JSON.stringify({
          ...params,
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
    *dragSorting({ payload, callback }, { put }) {
      yield put({
        type: 'updateList',
        payload,
      });
      if (callback) callback();
    },
    *postSorting({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/option/xstj/puts',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *delete({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/option/xstj/del',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const msg = {
        handler: '/v3/mp/option/xstj/adds',
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
