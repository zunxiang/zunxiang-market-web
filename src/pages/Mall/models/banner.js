import { GET } from '@/services/api';

export default {
  namespace: 'banner',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    popupAds: [],
  },
  effects: {
    *find({ payload, callback }, { call, put }) {
      const { currentPage, pageSize, ...params } = payload;
      const msg = {
        handler: '/v1/mp/option/banner/find',
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
        payload: {
          ...data,
        },
      });
      if (callback) callback(data);
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
        handler: '/v1/mp/option/banner/sort',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *delete({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/option/banner/delete',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *add({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/option/banner/add',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *createAd({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/option/banner/add_popup',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *findAd({ payload }, { call, put }) {
      const { currentPage, pageSize, ...params } = payload;
      const msg = {
        handler: '/v1/mp/option/banner/find_popup',
        message: JSON.stringify({
          ...params,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      yield put({
        type: 'findAdSuccess',
        payload: response.list,
      });
    },
  },

  reducers: {
    findSuccess(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    findAdSuccess(state, action) {
      return {
        ...state,
        popupAds: action.payload,
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
    operateSuccess(state) {
      return {
        ...state,
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
