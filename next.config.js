const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    clientsClaim: true,
    skipWaiting: true,
    inlineWorkboxRuntime: true,
  },
});
