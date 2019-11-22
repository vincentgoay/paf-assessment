const fs = require('fs');
const mysql = require('mysql');
const aws = require('aws-sdk');
const MongoClient = require('mongodb').MongoClient;

const loadConfig = (config) => {
    const mysqlConfig = config.mysql;
    mysqlConfig.ssl = {
        ca: fs.readFileSync(config.mysql.cacert)
    };
    return {
        pool: mysql.createPool(config.mysql),
        s3: new aws.S3({
            endpoint: new aws.Endpoint('sgp1.digitaloceanspaces.com'),
            accessKeyId: config.s3.accessKey,
            secretAccessKey: config.s3.secret
        }),
        client: new MongoClient(config.mongodb.url, { useUnifiedTopology: true })
    }
}

const testConnection = (conns) => {
    const promises = [
        new Promise(
            (resolve, reject) => {
                conns.pool.getConnection(
                    (err, conn) => {
                        if (err) {
                            console.error('Cannot get database: ', err);
                            reject(err)
                        }
                        conn.ping(err => {
                            if (err)
                                return reject(err);
                            resolve();
                        })
                    }
                )
            }
        ),
        new Promise(
            (resolve, reject) => {
                // Need to setup a file online and read that file to do handshake
                resolve();
            }
        ),
        new Promise(
            (resolve, reject) => {
                conns.client.connect(
                    (err, _) => {
                        if (err)
                            return reject(err)
                        resolve();
                    }
                )
            }
        )
    ]
    return Promise.all(promises);
}

module.exports = { loadConfig, testConnection }