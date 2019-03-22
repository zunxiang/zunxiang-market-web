import { query as queryUsers } from '@/services/user';
import { routerRedux } from 'dva/router';
/* eslint-disable-next-line */
import secureCipher from 'secure';
import { GET, POST } from '@/services/adminApi';
import { reloadAuthorized } from '@/utils/Authorized';
import { BaseImgUrl } from '@/common/config';

export default {
  namespace: 'adminUser',

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
    *fetchCurrent(_, { call, put, select }) {
      const msg = {
        handler: '/v1/admin/account/get_self',
        message: JSON.stringify({}),
      };
      const [code, response] = yield call(GET, msg);
      const currentPath = yield select(state => state.routing.location.pathname);
      if (code !== 0) return;
      const user = {
        name: response.username,
        username: response.username,
        avatar: response.logo || `${BaseImgUrl}/${'user.png'}`,
        userid: response.i,
        wxopenid: response.wxopenid,
      };
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
      if (currentPath === '/admin-user/login') {
        yield put({
          type: 'adminLogin/changeLoginStatus',
          payload: {
            status: 'ok',
            currentAuthority: [...response.view_power, 'defualt'],
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/admin/'));
      }
    },
    *changePassword({ payload, callback }, { call }) {
      const msg = {
        handler: '/v1/admin/account/change_password',
        message: JSON.stringify(secureCipher(JSON.stringify(payload))),
      };
      const [code] = yield call(POST, msg);
      if (code !== 0) return;
      if (callback) callback();
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
