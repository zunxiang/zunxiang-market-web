import { GET } from '@/services/api';

export default {
  namespace: 'franchiser',
  state: {
    data: {
      list: [],
      pagination: {},
      sum: {},
    },
    bill: {
      list: [],
      pagination: {},
      sum: {},
    },
  },
  effects: {
    *platfind({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/user/salesman/find',
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
        list: response.list.map(val => ({
          ...val,
          balance: val.balance / 100,
          amount: val.amount / 100,
          create_time: val.create_time.substring(0, 10),
        })),
        sum: response.sum,
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
      };
      if (callback) callback(data);
    },
    *paltopen({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/salesman/open',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *paltclose({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/salesman/close',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *paltallowBonus({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/salesman/open_bonus',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *paltcloseBonus({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/salesman/close_bonus',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *changeLevel({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/user/salesman/set_level',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
  },
  reducers: {
    findSuccess(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    billFindSuccess(state, action) {
      return {
        ...state,
        bill: action.payload,
      };
    },
  },
};
