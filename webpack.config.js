const path = require('path');
const autoprefixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Chunks2JsonPlugin = require('chunks-2-json-webpack-plugin');

// const OutputPath = process.env.ENV_MODE

module.exports = [{
  mode: "development", // "production" | "development" | "none"
  entry: {
    main: ['./src/ts/index.ts', './src/scss/index.scss']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './js/[hash].js'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    publicPath: '/',
    port: 8080,
    host: '0.0.0.0',
    compress: true,
  },
  watchOptions: {
    aggregateTimeout: 300,
    ignored: /node_modules/
  },
  module: {
    rules: [{
        test: /\.(png|jpg|gif|svg)$/,
        exclude: [
          path.resolve(__dirname, './node_modules'),
        ],
        use: {
          loader: 'file-loader',
          options: {
            name: '../images/[hash].[ext]'
          },
        },
      },
      {
        test: /\.scss$/,
        use: [{
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                includePaths: ['./node_modules']
              },
            }
          },
        ]
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-typescript'],
          },
        }],
        exclude: /node_modules/
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin({
  //     sourceMap: false,
  //   })],
  // },
  plugins: [
    new CopyPlugin([{
        from: './src/package.scss',
        to: './style.css',
        toType: 'file',
      },
      {
        from: './src/screenshot.png',
        to: './screenshot.png',
        toType: 'file',
      },
      {
        from: './src/images/',
        to: './images/[hash].[ext]',
        toType: 'template',
      },
      {
        from: './src/php/*.php',
        to: './[name].[ext]',
        toType: 'template',
      },
      {
        from: './src/php/*/*.php',
        to: './[1]/[2].[ext]',
        test: /src\/php\/([^/]+)\/(.+)\.php$/,
      },
      {
        from: './src/php/*/*/*.php',
        to: './[1]/[2]/[3].[ext]',
        test: /src\/php\/([^/]+)\/([^/]+)\/(.+)\.php$/,
      }
    ]),
    new RemovePlugin({
      before: {
        include: ['./dist']
      },
      after: {
        include: ['./images']
      }
    }),
    new MiniCssExtractPlugin({
      filename: "./css/[hash].css",
    }),
    new Chunks2JsonPlugin({
      outputDir: 'dist/',
      filename: 'manifest.json'
    })
  ],
}];