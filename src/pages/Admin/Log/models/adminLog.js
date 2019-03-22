import { GET } from '@/services/api';

export default {
  namespace: 'adminLog',
  state: {},
  effects: {
    *find({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/admin/error_log/find',
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
  },
  reducers: {},
};
