const path = require("path");

const prodPlugins = [];// 开发环境 不做操作

// 生产环境，去掉console
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console');
}

exports.resolve = function (dir) {
  let ph = path.join(__dirname, "..", dir);
  console.log("webpack:", ph)
  return ph;
};

// babel-loader配置
exports.babelLoaderConf = {
  loader: "babel-loader",
  options: {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            browsers: ["ie>=8", "chrome>=62"],
            node: "8.9.0",
          },
          debug: false,
          useBuiltIns: "usage",
          corejs: "3.0",
        },
      ],
      [
        "@babel/preset-typescript",
        {
          allExtensions: true, // 支持所有文件扩展名，否则在vue文件中使用ts会报错
        },
      ],
    ],
    plugins: [
      [
        "@babel/plugin-transform-runtime",
        {
          corejs: 3,
        },
      ],
      ...prodPlugins
    ],
  },
};
