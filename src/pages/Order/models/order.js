import { GET } from '@/services/api';

export default {
  namespace: 'order',
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
    *find({ payload, callback }, { call, put }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/order/mp_order/find',
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
        list: response.list.map(o => ({
          ...o,
          package: o.package ? JSON.parse(o.package) : {},
          skus: o.skus ? JSON.parse(o.skus) : [],
        })),
        sum: response.sum,
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
      };
      yield put({
        type: 'findSuccess',
        payload: {
          ...data,
        },
      });
      if (callback) callback(data);
    },
    *get({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/get',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const data = {
        ...response,
        travellers: response.travellers && JSON.parse(response.travellers),
        skus: JSON.parse(response.skus),
        package: JSON.parse(response.package),
      };
      if (callback) callback(data);
    },
    *finish({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/finish',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *refund({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/refund',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *getSms({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/get_finish_sms',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
    *sendSms({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/order/mp_order/send_finish_sms',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
  },

  reducers: {
    findSuccess(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    getSuccess(state, action) {
      return {
        ...state,
        currentOrder: action.payload,
      };
    },
    keepCurrent(state, action) {
      return {
        ...state,
        current: { ...action.payload },
      };
    },
    franchiserSuccess(state, action) {
      const { franchisers } = action.payload;
      return {
        ...state,
        franchisers,
      };
    },
    updateFreshtiem(state) {
      return {
        ...state,
        freshtime: new Date().getTime(),
      };
    },
  },
};
