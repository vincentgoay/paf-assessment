const fs = require('fs');

const startTransaction = (connection) => {
	return new Promise(
		(resolve, reject) => {
			connection.beginTransaction(
				error => {
					if (error)
						return reject({ connection, error })
					resolve({ connection })
				}
			)
		}
	)
}

const mkQueryFromPool = (qObj, pool) => {
	return params => {
		return new Promise(
			(resolve, reject) => {
				pool.getConnection(
					(err, conn) => {
						if (err)
							return reject(err)
						qObj({ connection: conn, params: params || [] })
							.then(status => { resolve(status.result) })
							.catch(status => { reject(status.error) })
							.finally(() => conn.release())
					}
				)
			}
		)
	}
}

const mkQuery = function (sql) {
	return status => {
		const conn = status.connection;
		const params = status.params || [];
		return new Promise(
			(resolve, reject) => {
				conn.query(sql, params,
					(err, result) => {
						if (err)
							return reject({ connection: status.connection, error: err });
						resolve({ connection: status.connection, result });
					}
				)
			}
		)
	}
}

const passthru = (status) => Promise.resolve(status)

const logError = (msg = "Error: ") => {
	return (status) => {
		console.error(msg, status.error);
		return Promise.reject(status);
	}
}

const commit = (status) => {
	return new Promise(
		(resolve, reject) => {
			const conn = status.connection;
			conn.commit(err => {
				if (err)
					return reject({ connection: conn, error: err });
				resolve({ connection: conn });
			})
		}
	)
}

const rollback = (status) => {
	return new Promise(
		(resolve, reject) => {
			const conn = status.connection;
			conn.rollback(err => {
				if (err)
					return reject({ connection: conn, error: err });
				reject({ connection: conn, error: status.error });
			})
		}
	)
}

const downloadImage = (params, connection) => {
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

module.exports = { startTransaction, mkQuery, commit, rollback, mkQueryFromPool, passthru, logError};
