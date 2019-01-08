import { POST, GET } from '@/services/api';

export default {
  namespace: 'mallSetting',
  state: {},
  effects: {
    *get({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/option/app_config/get',
        message: JSON.stringify(payload),
      };
      const [code, data] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(data);
    },
    *set({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/option/app_config/set',
        message: JSON.stringify(payload),
      };
      const [code, data] = yield call(POST, msg);
      if (code !== 0) return;
      if (callback) callback(data);
    },
  },

  reducers: {},
};
