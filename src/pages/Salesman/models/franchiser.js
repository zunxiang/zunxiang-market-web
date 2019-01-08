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
    *platfind({ payload, callback }, { call, put }) {
      const { currentPage, pageSize, ...params } = payload;
      const msg = {
        handler: '/v1/mp/salesman/salesman/find',
        message: JSON.stringify({
          ...params,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const data = {
        list: response.list,
        sum: response.sum,
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
      };
      yield put({
        type: 'findSuccess',
        payload: { ...data },
      });
      if (callback) callback();
    },
    *paltopen({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/salesman/salesman/open',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *paltclose({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/salesman/salesman/close',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *paltallowBonus({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/salesman/salesman/open_bonus',
        message: JSON.stringify(payload),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *paltcloseBonus({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/salesman/salesman/close_bonus',
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
