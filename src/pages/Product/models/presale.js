import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { GET } from '@/services/api';

export default {
  namespace: 'presale',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    currentPresale: {},
  },
  effects: {
    *find({ payload, callback }, { call, put }) {
      const { currentPage, pageSize, params } = payload;
      const msg = {
        handler: '/v2/admin/item/rush/find',
        message: JSON.stringify({
          ...params,
          limit: `${(currentPage - 1) * pageSize},${pageSize}`,
        }),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const data = {
        list: response.list,
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
        sum: response.sum,
      }
      yield put({
        type: 'findSuccess',
        payload: {
          ...data,
        }
      });
      if(callback) callback(data)
    },
    *get({ payload, callback }, { call }) {
      const msg = {
        handler: '/v2/merchant/item/rush/get',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return
      if (callback) callback(response);
    },
    *open({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/item/rush/open',
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
        handler: '/v2/admin/item/rush/close',
        message: JSON.stringify(payload),
      };
      const [cdoe, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *editPresale({ payload }, { put }) {
      yield put({
        type: 'keepCurrent',
        payload: payload.record,
      });
      yield put(routerRedux.push(`/presale/public?type=${payload.type}`));
    },
    *publicAdd({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/item/rush/add',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback();
      yield put(routerRedux.push('/presale/list'));
    },
    *publicPost({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/item/rush/post',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if(code !== 0) return;
      if (callback) callback();
      yield put(routerRedux.push('/presale/list'));
    },
    *wechatPush({ payload, callback }, { call, put }) {
      const msg = {
        handler: '/v2/admin/item/rush/wx_notice',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if(code !== 0) return;
      if (callback) callback();
      yield put(routerRedux.push('/presale/list'));
    },
    *dragSorting({ payload, callback }, { put }) {
      yield put({
        type: 'updateList',
        payload,
      });
      if (callback) callback();
    },
    *postSorting({ payload, callback }, { call }) {
      const msg = {
        handler: '/v2/admin/item/rush/post',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if(code !== 0) return;
      if (callback) callback();
      yield put(routerRedux.push('/presale/list'));
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
    keepCurrent(state, action) {
      return {
        ...state,
        currentPresale: action.payload,
      };
    },
    updateList(state, action) {
      const { payload: { list } } = action;
      const data = { ...state.data, list };
      return {
        ...state,
        data,
      };
    },
  },
};
