const path = require("path");
const TsconfigPathsPlugin = require("../index");

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./index",
  output: {
    path: path.join(__dirname, "temp"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        exclude: /^node_modules/,
        loader: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: "./tsconfig.example2.json",
        logLevel: "info",
        extensions: [".ts", ".tsx"],
        colors: true,
        logInfoToStdOut: true
        // baseUrl: "/foo"
      })
    ]
  }
};
