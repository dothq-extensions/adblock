const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')

const srcDir = '../src'
const htmlFiles = require('../src/frontend/html/pages')

module.exports = {
  entry: {
    popup: path.join(__dirname, `${srcDir}/frontend/ui/popup/popup.tsx`),
    settings: path.join(
      __dirname,
      `${srcDir}/frontend/ui/settings/settings.tsx`
    ),
    stats: path.join(__dirname, `${srcDir}/frontend/ui/stats/stats.ts`),
    background: path.join(__dirname, `${srcDir}/backend/background.ts`),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              import: false,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /\.module\.css$/,
      },
      //* File loader for rust code
      {
        test: /\.rs$/,
        exclude: /node_modules/,
        use: {
          loader: 'rust-wasm-loader',
          options: {
            // The path to the webpack output relative to the project root
            path: 'dest',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // Move all of the icons from the icons folder to public. This is for
        // any icons specified in the manifest file
        { from: './frontend/icons', to: './icons', context: 'src' },

        // Copy all of the html files in the html folder to public
        ...htmlFiles.map((file) => ({
          from: `./frontend/html/${file}`,
          to: `./${file}`,
          context: 'src',
        })),

        // Copy the manifest file to public
        {
          from: './constants/manifest.json',
          to: './manifest.json',
          context: 'src',
        },
      ],
    }),

    // Nice clean progress bar for webpack
    new WebpackBar(),
  ],
  // The .wasm 'glue' code generated by Emscripten requires these node builtins,
  // but won't actually use them in a web environment. We tell Webpack to not resolve those
  // require statements since we know we won't need them.
  externals: {
    fs: true,
    path: true,
  },
}
