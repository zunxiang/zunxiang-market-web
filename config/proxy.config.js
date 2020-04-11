const proxyList = ['/captcha', '/api', '/apis', '/db', '/post_api', '/ueditor', '/v1'];

const proxObject = {};

proxyList.forEach(key => {
  proxObject[key] = {
    // target: 'http://0800000000000000.yun.zxtgo.com',
    target: 'https://nayou.shop.vipsys.net/',
    changeOrigin: true,
    secure: false,
  };
});

export default proxObject;
