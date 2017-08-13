import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import cleanup from 'rollup-plugin-cleanup'

const options = {
  entry: 'src/stream.js',
  dest: 'lib/gif-stream.js',
  sourceMap: true,
  moduleName: 'GifStream',
  plugins: [
    babel({
      babelrc: false,
      presets: ['es2015-rollup'],
      runtimeHelpers: false,
      externalHelpers: false,
      exclude: 'node_modules/**',
    }),
    cleanup(),
  ],
  format: 'umd',
}

export default [
  options,
  Object.assign({}, options, {
    dest: 'lib/gif-stream.min.js',
    plugins: options.plugins.concat(uglify()),
    sourceMap: false,
  }),
]
