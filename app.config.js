export default ({ config }) => ({
  ...config,
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    backgroundColor: "#ffffff",
    imageWidth: 1024,
  },
  name: "Dealive",
  slug: "dealive-mobile",
  version: "1.1.3",
  orientation: "portrait",
  icon: "./assets/icon.png",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  android: {
    package: "ru.dealive.mobile", // Уникальный идентификатор пакета
  },
});
