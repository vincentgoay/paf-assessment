const fs = require('fs');

const uploadFile = (path, params, connection) => {
	return (new Promise(
		(resolve, reject) => {
			fs.readFile(path,
				(err, imageFile) => {
					params['Body'] = imageFile;
					connection.putObject(params, (err, result) => {
						if (err)
							return reject(err);
						resolve(result);
					})
				}
			)
		})
	)
}

const downloadFile = (params, connection) => {
	return (new Promise(
		(resolve, reject) => {
			connection.getObject(params, (err, result) => {
				if (err)
					return reject(err);
				resolve(result);
			})
		}
	))
}

module.exports = { uploadFile, downloadFile }

