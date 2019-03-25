import babel from 'rollup-plugin-babel'
import cleanup from 'rollup-plugin-cleanup'
import { uglify } from 'rollup-plugin-uglify'

const options = {
  input: 'src/stream.js',
  output: {
    file: 'lib/index.js',
    name: 'GifStream',
    format: 'umd',
    sourcemap: false,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    cleanup(),
  ],
}

export default [
  options,
  Object.assign({}, options, {
    output: Object.assign({}, options.output, {
      file: 'lib/gif-stream.min.js',
      sourcemap: true,
    }),
    plugins: options.plugins.concat(uglify()),
  }),
]
