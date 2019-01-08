import { GET } from '@/services/api';

export default {
  namespace: 'withdraw',
  state: {},
  effects: {
    *find({ payload, callback }, { call }) {
      const { currentPage, pageSize, ...pramas } = payload;
      const msg = {
        handler: '/v1/mp/salesman/withdraw/find',
        message: JSON.stringify({
          ...pramas,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) {
        callback({
          list: response.list,
          pagination: {
            current: currentPage,
            pageSize,
            total: response.total,
          },
          sum: response.sum,
        });
      }
    },
    *finish({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/salesman/withdraw/finish',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response[1]);
    },
    *error({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/salesman/withdraw/error',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response[1]);
    },
  },
  reducers: {},
};
