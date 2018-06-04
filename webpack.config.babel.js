const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["./src/app.js", "./public/css/main.css", "./public/css/directory.css"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public")
  },
  watch: true,
  //cache: false,
  mode:'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["react", "env", "stage-1"]
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      }
    ]
  }
};
