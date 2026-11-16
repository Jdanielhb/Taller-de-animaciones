module.exports = function (api) {
  api.cache(true);
  // babel-preset-expo ya incluye automáticamente el plugin de Reanimated (SDK 50+)
  return { presets: ['babel-preset-expo'] };
};
