import { notification } from 'antd';
import { GET } from '@/services/api';

export default {
  namespace: 'customer',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *find({ payload }, { call, put }) {
      const { currentPage, pageSize } = payload;
      const msg = {
        handler: '/v2/admin/user/main/find',
        message: JSON.stringify({
          ...payload,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
        }),
      };
      const response = yield call(GET, msg);
      if (response[0] === 0) {
        yield put({
          type: 'findSuccess',
          payload: {
            list: response[1].list,
            pagination: {
              current: currentPage,
              pageSize,
              total: response[1].total,
            },
          },
        });
      } else {
        notification.error({
          message: '错误提示',
          description: response[1],
        });
      }
    },
    *changeSalesman({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/user/main/change_salesman',
        message: JSON.stringify(payload),
      };
      const response = yield call(GET, msg);
      if (response[0] === 0) {
        yield put({
          type: 'operateSucces',
          payload,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '错误提示',
          description: response[1],
        });
      }
    },
    *giveCoupon({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/user/main/give_coupon',
        message: JSON.stringify(payload),
      };
      const response = yield call(GET, msg);
      if (response[0] === 0) {
        yield put({
          type: 'operateSucces',
          payload,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '错误提示',
          description: response[1],
        });
      }
    },
    *open({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/user/main/open',
        message: JSON.stringify(payload),
      };
      const response = yield call(GET, msg);
      if (response[0] === 0) {
        yield put({
          type: 'operateSucces',
          payload,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '错误提示',
          description: response[1],
        });
      }
    },
    *close({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/user/main/close',
        message: JSON.stringify(payload),
      };
      const response = yield call(GET, msg);
      if (response[0] === 0) {
        yield put({
          type: 'operateSucces',
          payload,
        });
        if (callback) callback();
      } else {
        notification.error({
          message: '错误提示',
          description: response[1],
        });
      }
    },
  },
  reducers: {
    findSuccess(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    operateSuccess(state) {
      return {
        ...state,
      };
    },
  },
};
