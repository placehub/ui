const WindiCSS = require('vite-plugin-windicss');

module.exports = {
  async viteFinal(config, { configType }) {
    config.plugins = [
      ...config.plugins,
      WindiCSS.default(),
    ];

    return config;
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/vue3",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  "features": {
    "storyStoreV7": true
  }
}