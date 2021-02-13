const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBar = require('webpackbar')

const srcDir = '../src'
const htmlFiles = require('../src/frontend/html/pages')

module.exports = {
  entry: {
    popup: path.join(__dirname, `${srcDir}/frontend/ui/popup/popup.ts`),
    settings: path.join(
      __dirname,
      `${srcDir}/frontend/ui/settings/settings.tsx`
    ),
    background: path.join(__dirname, `${srcDir}/backend/background.ts`),
  },
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
        { from: './frontend/icons', to: '../icons', context: 'src' },

        // Copy all of the html files in the html folder to public
        ...htmlFiles.map((file) => ({
          from: `./frontend/html/${file}`,
          to: `../${file}`,
          context: 'src',
        })),

        // Copy the manifest file to public
        {
          from: './frontend/constants/manifest.json',
          to: '../manifest.json',
          context: 'src',
        },
      ],
    }),

    // Copy all of the html files in the html folder to public
    ...htmlFiles.map(
      (file) =>
        new HtmlWebpackPlugin({
          inject: false,
          hash: false,
          template: `src/frontend/html/${file}`,
          filename: `../${file}`,
        })
    ),

    // Nice clean progress bar for webpack
    new WebpackBar(),
  ],
}
