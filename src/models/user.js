import { query as queryUsers } from '@/services/user';
import { routerRedux } from 'dva/router';
import { GET } from '@/services/api';
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
        handler: '/v2/admin/main/get_self',
        message: JSON.stringify({}),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      const user = {
        name: response.username,
        avatar: `${BaseImgUrl}/${response.logo || 'user.png'}`,
        userid: response.i,
      };
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      });
      const currentPath = yield select(state => state.routing.location.pathname);
      if (currentPath === '/user/login') {
        yield put(routerRedux.push('/'));
      }
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
