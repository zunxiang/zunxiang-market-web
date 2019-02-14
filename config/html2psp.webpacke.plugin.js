/*eslint-disable */
const { RawSource } = require('webpack-sources');

class html2pspPlugin {
  apply = compiler => {
    compiler.hooks.emit.tapAsync('html2pspPlugin', (compilation, callback) => {
      for (const filename in compilation.assets) {
        if (filename.indexOf('html') !== -1) {
          const html = compilation.assets[filename].source();
          const data = `<%def name="main(self, use_session=True)">\n${html}\n</%def>`;
          compilation.assets[`${filename}.psp`] = new RawSource(data);
          // delete compilation.assets[filename]
        }
      }
      callback();
    });
  };
}

module.exports = html2pspPlugin;
