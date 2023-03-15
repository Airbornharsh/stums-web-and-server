module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: true,
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: "*",
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: "*",
          },
        ],
      },
    ]
  },
}

// "Access-Control-Allow-Origin": "*", // Required for CORS support to work
//   "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
//   "Access-Control-Allow-Headers": "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale",
//   "Access-Control-Allow-Methods": "POST, OPTIONS"