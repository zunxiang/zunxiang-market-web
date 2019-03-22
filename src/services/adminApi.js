import { stringify } from 'qs';
import request from '@/utils/adminRequest';

export async function GET(params) {
  return request(`/db/v1/api?${stringify(params)}`);
}

export async function POST(params) {
  const data = new FormData();
  const blob = new Blob([JSON.stringify(params)], { type: 'text/json' });
  data.append('data', blob);
  return request('/db/v1/post_api', {
    method: 'POST',
    body: data,
  });
}
