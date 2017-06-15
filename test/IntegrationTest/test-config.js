var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
exports.DB = 'mongodb://localhost/test1';

exports.connect = (callback) => {
	mongoose.connect(exports.DB,callback);
}

exports.close = (callback) => {
	mongoose.connection.close(callback);
}

exports.getConnection = () => {
	return mongoose.connection;
}


