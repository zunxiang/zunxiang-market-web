import { query as queryUsers } from '@/services/user';
import { routerRedux } from 'dva/router';
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
        avatar: `${BaseImgUrl}/${response.logo || 'user.png'}`,
        userid: response.i,
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
