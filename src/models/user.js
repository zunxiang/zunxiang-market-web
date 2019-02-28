import { query as queryUsers } from '@/services/user';
import { routerRedux } from 'dva/router';
/* eslint-disable-next-line */
import secureCipher from 'secure';
import { GET, POST } from '@/services/api';
import { reloadAuthorized } from '@/utils/Authorized';
import { BaseImgUrl } from '@/common/config';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchInfo({ callback }, { call, put }) {
      const msg = {
        handler: '/v1/mp/app_account/account/get_info',
        message: JSON.stringify({}),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const user = {
        name: response.name,
        username: response.username,
        avatar: response.logo || `${BaseImgUrl}/${'user.png'}`,
        userid: response.i,
        wxopenid: response.wxopenid,
      };
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
      if (callback) callback(user);
    },
    *fetchCurrent(_, { call, put, select }) {
      const msg = {
        handler: '/v1/mp/app_account/account/get_self',
        message: JSON.stringify({}),
      };
      const [code, response] = yield call(GET, msg);
      const currentPath = yield select(state => state.routing.location.pathname);
      if (code !== 0) return;
      const user = {
        name: response.name,
        username: response.username,
        avatar: response.logo || `${BaseImgUrl}/${'user.png'}`,
        userid: response.i,
        wxopenid: response.wxopenid,
      };
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
      if (currentPath === '/user/login') {
        yield put({
          type: 'login/changeLoginStatus',
          payload: {
            status: 'ok',
            currentAuthority: [...response.view_power, 'defualt'],
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },
    *changePassword({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/app_account/account/change_password',
        message: JSON.stringify(secureCipher(JSON.stringify(payload))),
      };
      const [code] = yield call(POST, msg);
      if (code !== 0) return;
      if (callback) callback();
    },
    *findSubscript({ payload, callback }, { call }) {
      const { currentPage, pageSize, order, ...params } = payload;
      const msg = {
        handler: '/v1/mp/item/item/find',
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
        list: response.list,
        pagination: {
          current: currentPage,
          pageSize,
          total: response.total,
        },
        sum: response.sum,
      };
      if (callback) callback(data);
    },
    *unsubscript({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/mp/item/item/unbook_order_notice',
        message: JSON.stringify(payload),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
