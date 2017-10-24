var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './bundle'),
    publicPath: '/bundle/',
    filename: 'js/build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        enforce: "pre",
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          fix: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: isProduction ?
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          }) : ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: isProduction ?
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          }) : ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]?[hash]',
          publicPath: isProduction ? '../' : '/bundle/'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    },
    extensions: ['.vue', '.js', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  target: 'electron-renderer',
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new ExtractTextPlugin("css/style.css"),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
