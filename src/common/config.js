import { GET } from '../services/api';
const BaseImgUrl = 'http://img.zxtgo.com/';
const getQiniuToken = () => {
  return GET({
    handler: '/v2/qiniu/main/get_upload_token',
    message: JSON.stringify({ bucket: 'zunxiang' }),
  }).then(response => response[1]);
};

const mapKey = 'LS3BZ-D7MWU-FYXVB-4IWUE-5SJX7-NJFL5';

export { BaseImgUrl, getQiniuToken, mapKey };
