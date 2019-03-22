import { GET } from '@/services/api';

export default {
  namespace: 'adminWithdraw',
  state: {},
  effects: {
    *find({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/admin/user/withdraw/find',
        message: JSON.stringify({
          query: [params],
          order,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
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
        handler: '/v1/admin/salesman/withdraw/finish',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response[1]);
    },
    *error({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/admin/salesman/withdraw/error',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response[1]);
    },
  },
  reducers: {},
};
