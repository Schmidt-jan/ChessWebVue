const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: true,
    pwa: {
        themeColor: "#5c68b5",
        backgroundColor: '#5c68b5',
        msTileColor: '#5c68b5',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
    }
});
