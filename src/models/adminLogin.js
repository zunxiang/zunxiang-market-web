import { routerRedux } from 'dva/router';
/* eslint-disable */
import secureCipher from 'secure';
/* eslint-disable */
import { stringify } from 'qs';
import { GET, getFakeCaptcha } from '@/services/adminApi';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'adminLogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const { userName: username, password, captcha } = payload;
      const msg = {
        handler: '/v1/admin/account/login',
        message: JSON.stringify(
          secureCipher(
            JSON.stringify({
              username,
              password,
              captcha,
            })
          )
        ),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) {
        if (callback) callback();
        return;
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          currentAuthority: [...response.view_power, 'defualt'],
        },
      });
      reloadAuthorized();
      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = redirect;
          return;
        }
      }
      if (redirect && redirect.indexOf('/admin/login') !== -1) {
        redirect = '/admin/';
      }
      yield put(routerRedux.replace(redirect || '/admin/'));
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put, call, select }) {
      const msg = {
        handler: '/v1/admin/account/logout',
        message: JSON.stringify({}),
      };
      const [code] = yield call(GET, msg);
      if (code !== 0) return;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: [],
        },
      });
      reloadAuthorized();
      const currentPath = yield select(state => state.routing.location.pathname);
      if (currentPath !== '/admin-user/login') {
        yield put(
          routerRedux.push({
            pathname: '/admin-user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
