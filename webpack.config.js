const path = require('path')
const webpack = require('webpack')
const DotenvPlugin = require('webpack-dotenv-plugin')

module.exports = {
  devtool: 'source-map',
  devServer: {
    stats: 'errors-only'
  },
  entry: [
    './src/client/main.jsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new DotenvPlugin({ sample: './.env.example' }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.js|\.jsx$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src/client')
      },
      { test: /\.css$/, loaders: ['style', 'css']},
      { test: /\.cjsx$/, loaders: ['coffee', 'cjsx']}
    ]
  }
}
