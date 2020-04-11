import { stringify } from 'qs';
import request from '@/utils/request';
import { apiMap } from './apiMap';

export async function GET({ handler, message }) {
  if (!apiMap[handler]) {
    return Promise.resolve([404, `没有接口${apiMap[handler]}`]);
  }
  const msg = JSON.parse(message);
  if (handler.substr(-5, 5) === '/find') {
    const { limit, offset, order, SUM: sum, ...query } = msg;
    const params = {
      limit,
      offset,
      order,
      sum,
      query: [query],
    };
    return request(apiMap[handler], {
      method: 'POST',
      body: params,
    });
  }
  return request(`${apiMap[handler]}?${stringify(msg)}`);
  // return request(`/db/v1/api?${stringify(params)}`);
}

export async function POST({ handler, message }) {
  const msg = JSON.parse(message);
  console.log(handler.substr(-4, 4));
  if (handler.substr(-4, 4) === '/find') {
    const { limit, offset, order, SUM: sum, ...query } = msg;
    const params = {
      limit,
      offset,
      order,
      sum,
      query: [query],
    };
    return request(apiMap[handler], {
      method: 'POST',
      body: params,
    });
  }
  return request(apiMap[handler], {
    method: 'POST',
    body: msg,
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
