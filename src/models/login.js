import { routerRedux } from 'dva/router';
import secureCipher from 'secure';
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
    *login({ payload }, { call, put }) {
      const { userName: username, password, captcha } = payload;
      const msg = {
        handler: '/v2/admin/main/login',
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
      if (code !== 0) return;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          currentAuthority: [...response.power, 'defualt'],
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

    *logout(_, { put, call }) {
      const msg = {
        handler: '/v2/admin/main/logout',
        message: JSON.stringify({}),
      };
      const [code, response] = yield call(GET, msg);
      if (code !== 0) return;
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: [],
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
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
