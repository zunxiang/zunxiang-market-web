import { GET } from '@/services/api';

const handlers = {
  item: '/v1/mp/item/item/find',
  order: '/v1/mp/order/mp_order/find',
  user: '/v1/mp/user/user/find',
  salesman: '/v1/mp/user/salesman/find',
};
export default {
  namespace: 'statistics',
  state: {
    data: {
      list: [],
      sum: {},
      pagination: {},
    },
    current: {},
    freshtime: null,
  },
  effects: {
    *count({ payload, callback }, { call }) {
      const { order, name, ...params } = payload;
      const msg = {
        handler: handlers[name],
        message: JSON.stringify({
          query: [params],
          order,
          limit: 1,
          offset: 0,
        }),
      };
      const [code, data] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(data.total);
    },
  },

  reducers: {},
};
