export default ({ config }) => ({
  ...config,
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  name: "Dealive - срочная доставка",
  slug: "dealive-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
});
