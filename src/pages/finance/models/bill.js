import { GET } from '@/services/api';

export default {
  namespace: 'bill',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    current: {},
  },
  effects: {
    *find({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/assets/bill/find',
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
        list: response.list.map(bill => ({
          ...bill,
          amount: bill.amount / 100,
          balance: bill.balance / 100,
          create_time: bill.create_time.substring(0, 19),
        })),
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
        sum: response.sum,
      };
      if (callback) callback(data);
    },
    *get({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/get',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *charge({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/assets/recharge/add',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *getBalance({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/app_account/account/get_app_info',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
  },

  reducers: {},
};
