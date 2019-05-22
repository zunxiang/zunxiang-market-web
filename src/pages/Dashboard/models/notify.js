import { GET } from '@/services/api';

export default {
  namespace: 'notify',

  state: {},

  effects: {
    *find({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/message/find',
        message: JSON.stringify({
          query: [params],
          order,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
        }),
      };
      const [code, data] = yield call(GET, msg);
      if (code !== 0) return;
      const newData = {
        list: data.list,
        pagination: {
          current: currentPage,
          pageSize: 10,
          total: data.total,
        },
      };
      if (callback) callback(newData);
    },
  },

  reducers: {},
};
