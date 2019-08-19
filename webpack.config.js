const path = require('path')
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  entry: './paginate.ts',
  devtool: 'source-map',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'paginator'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.ts', '.js' ]
  },
  plugins: [
      new CheckerPlugin()
  ]
}
