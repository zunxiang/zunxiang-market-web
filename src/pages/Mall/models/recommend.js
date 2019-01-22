import { GET, POST } from '@/services/api';

export default {
  namespace: 'recommend',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *findProduct({ payload, callback }, { call }) {
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
      };
      if (callback) callback(data);
    },
    *get({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/option/app_config/get',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const { index_items: list } = response;
      const items = list ? JSON.parse(list) : [];
      if (callback) callback(items);
    },
    *set({ payload, callback }, { call }) {
      const { list } = payload;
      const msg = {
        handler: '/v1/mp/option/app_config/set',
        message: JSON.stringify({
          index_items: JSON.stringify(list),
        }),
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
