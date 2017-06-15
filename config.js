const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
		domain : "http://127.0.0.1",
    port: process.env.PORT || 3000 
  },
  mongo: {
    url: process.env.MONGO_DB_URI || 'mongodb://localhost/test'
  }
};

module.exports = config;
