module.exports = {
  eslint: {
    enable: false
  },
  const path = require('path');

{
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devServer: {
    port: 3000, // Use port 3000 instead of 3001
  },
};
