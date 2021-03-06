const path = require('path');
const webpack = require("webpack");
const webpack_rules = [];
const webpackOption = {
  entry: './src/browser.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'convext.min.js'
  },
  module: {
    rules: webpack_rules
  }
};

let babelLoader = {
  test: /\.js$/,
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: "babel-loader",
    options: {
      presets: [
        ["@babel/preset-env",
          {
            "targets": {
              "ie": 11
            }
          }
        ]
      ]
    }
  }
};
webpack_rules.push(babelLoader);
module.exports = webpackOption;