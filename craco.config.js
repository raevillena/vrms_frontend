const path = require('path');

module.exports = {
  webpack: {

    alias: {
      '@': path.join(path.resolve(__dirname, 'src')),
      '@pages': path.join(path.resolve(__dirname, 'src', 'pages')),
      '@components': path.join(path.resolve(__dirname, 'src', 'components')),
      '@routes': path.join(path.resolve(__dirname, 'src', 'routes')),
      '@services': path.join(path.resolve(__dirname, 'src', 'services')),
      '@reducers': path.join(path.resolve(__dirname, 'src', 'reducers')),

    },
  },
};