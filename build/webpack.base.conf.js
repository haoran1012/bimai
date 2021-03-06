const { resolve, babelLoaderConf } = require('./utils.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vueLoader = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: {
    app: resolve('src/index.ts'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts', '.tsx', '.mjs'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/, // 不解析库
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
          },
        ],
        include: /(src)/,
      },
      {
        test: /\.(ts|js)x?$/,
        use: [babelLoaderConf],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/assets/svg')],
        options: {
          symbolId: 'icon-[name]',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'images/[base]',
        },
        exclude: [resolve('src/assets/svg')],
      },
      {
        test: /\.(woff2?|eot|ttf|otf|ifc|dwg)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'files/[base]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'media/[base]',
        },
      },
    ],
  },

  plugins: [
    // vue-loader插件
    new vueLoader.VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('public/index.html'),
      favicon: resolve('public/logo.png'),
      inject: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from:resolve('/src/assets/wasmDir/'),
          to: resolve('/dist/js/wasmDir/')
        }
      ],
    }),
  ],
}
