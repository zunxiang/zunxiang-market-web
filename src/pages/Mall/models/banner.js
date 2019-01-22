import { GET, POST } from '@/services/api';

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
    *get({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/option/app_config/get',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const { banner } = response;
      const list = banner ? JSON.parse(banner) : [];
      if (callback) callback(list);
    },
    *set({ payload, callback }, { call }) {
      const { banner } = payload;
      const msg = {
        handler: '/v1/mp/option/app_config/set',
        message: JSON.stringify({
          banner: JSON.stringify(banner),
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
