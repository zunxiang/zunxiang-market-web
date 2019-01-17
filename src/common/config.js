import { GET } from '@/services/api';

export const BaseImgUrl = 'http://img.zxtgo.com/';
export const getQiniuToken = () =>
  GET({
    handler: '/v1/qiniu/main/get_upload_token',
    message: JSON.stringify({ bucket: 'zunxiang' }),
  }).then(response => response[1]);

export const mapKey = 'LS3BZ-D7MWU-FYXVB-4IWUE-5SJX7-NJFL5';
