const path = require('path');

module.exports = {
  webpack: {

    alias: {
      '@': path.join(path.resolve(__dirname, 'src')),
      '@pages': path.join(path.resolve(__dirname, 'src', 'pages')),
      '@components': path.join(path.resolve(__dirname, 'src', 'components')),
      '@services': path.join(path.resolve(__dirname, 'src', 'services')),
    },
  },
};