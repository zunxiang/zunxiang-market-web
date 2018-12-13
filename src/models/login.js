import { routerRedux } from 'dva/router';
/* eslint-disable */
import secureCipher from 'secure';
/* eslint-disable */
import { stringify } from 'qs';
import { GET, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const { userName: username, password, captcha } = payload;
      const msg = {
        handler: '/v3/mp/app_account/account/login',
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
      if (redirect.indexOf('/login') !== -1) {
        redirect = '/';
      }
      yield put(routerRedux.replace(redirect || '/'));
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put, call, select }) {
      const msg = {
        handler: '/v3/mp/app_account/account/logout',
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
      if (currentPath !== '/user/login') {
        yield put(
          routerRedux.push({
            pathname: '/user/login',
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
