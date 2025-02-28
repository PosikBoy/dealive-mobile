export default ({ config }) => ({
  ...config,
  icon: "./src/assets/icon.png",
  name: "Dealive",
  slug: "dealive-mobile",
  version: "1.1.3",
  orientation: "portrait",
  icon: "./src/assets/icon.png",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  android: {
    package: "ru.dealive.mobile", // Уникальный идентификатор пакета
  },
});
