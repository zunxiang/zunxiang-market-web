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
    target: 'http://dev.zxtgo.com/',
    changeOrigin: true,
    secure: false,
  }
});

export default proxObject