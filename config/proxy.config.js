const proxyList = [
  '/captcha',
  '/api',
  '/apis',
  '/db',
  '/post_api',
  '/ueditor',
]

const proxObject = {}

proxyList.forEach(key => {
  proxObject[key] = {
    target: 'http://0800000000000000.yun.zxtgo.com/',
    changeOrigin: true,
    secure: false,
  }
});

export default proxObject
