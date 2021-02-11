const path = require('path');
const autoprefixer = require('autoprefixer');
const ESLintPlugin = require('eslint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(scss)$/,
        use: [
          // inject CSS to page
          { loader: 'style-loader' },
          // translates CSS into CommonJS modules
          { loader: 'css-loader' },
          // Run postcss actions
          {
            loader: 'postcss-loader',
            options: {
            // `postcssOptions` is needed for postcss 8.x;
              postcssOptions: {
                // postcss plugins, can be exported to postcss.config.js
                plugins: () => [autoprefixer],
              },
            },
          },
          // compiles Sass to CSS
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'template.html',
    }),
  ],
  devServer: {
    open: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
};
