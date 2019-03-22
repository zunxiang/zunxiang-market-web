import { GET } from '@/services/api';

export default {
  namespace: 'adminAnnouncement',
  state: {},
  effects: {
    *find({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/admin/platform_bulletin/find',
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
    *add({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/admin/platform_bulletin/add',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *edit({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/admin/platform_bulletin//post',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
  },
  reducers: {},
};
