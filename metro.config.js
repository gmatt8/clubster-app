const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ws: require.resolve('./empty-shim.js'),
  events: require.resolve('./empty-shim.js'),
  stream: require.resolve('./empty-shim.js'),
  net: require.resolve('./empty-shim.js'),
  tls: require.resolve('./empty-shim.js'),
  http: require.resolve('./empty-shim.js'),
  https: require.resolve('./empty-shim.js'),
  zlib: require.resolve('./empty-shim.js'),
  crypto: require.resolve('./empty-shim.js'),
  url: require.resolve('./empty-shim.js'),
  util: require.resolve('./empty-shim.js'),
  assert: require.resolve('./empty-shim.js'),
  fs: require.resolve('./empty-shim.js'),
  path: require.resolve('./empty-shim.js'),
  os: require.resolve('./empty-shim.js'),
};
module.exports = config;
