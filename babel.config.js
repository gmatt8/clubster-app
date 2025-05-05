module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        allowUndefined: false,
      }],
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@': './',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      }],
    ],
  };
};
