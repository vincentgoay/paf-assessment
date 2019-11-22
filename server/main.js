const fs = require('fs');
const { join } = require('path');
const uuid = require('uuid');
const express = require('express');
const hbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');
const mysql = require('mysql');
const aws = require('aws-sdk');

const db = require('./dbutil');
const s3 = require('./s3utils');

// TODO - Task 2
// Configure your databases
const { loadConfig, testConnection } = require('./initUtils');
let config = require('./config');
if (fs.existsSync(__dirname + '/config.js')) {
	config = require('./config');
} else {
	config.mysql = {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		connectionLimit: process.env.DB_CONNECTION_LIMIT,
		ssl: { ca: process.env.DB_CA_CERT }
	}

	config.s3 = {
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_KEY
	}

	config.mongodb = { url: process.env.MONGO_URL }
}

const conns = loadConfig(config);

const PORT = parseInt(process.argv[2] || process.env.PORT) || 3000;
const upload = multer({ dest: join(__dirname, 'tmp') });

const GET_COUNTRIES = 'select * from countries';
const REPLACE_SONG = 'replace into songs(title, song_url, country_code, lyrics, slot, available) values (?, ?, ?, ?, ?, ?)';
const GET_SONG_LIST = 'select s.title, s.country_code, c.name, s.slot, s.available FROM songs as s join countries as c on s.country_code = c.code';
const INSERT_CHECKOUT_BY_SONG = 'insert into checkouts(country_code, user_id) values (?, ?)';
const GET_USERS = 'select * from users';
const UPDATE_AVAILABILITY = 'update songs set available = available - ? where country_code = ?';

const getCountries = db.mkQueryFromPool(db.mkQuery(GET_COUNTRIES), conns.pool);
const replaceSong = db.mkQueryFromPool(db.mkQuery(REPLACE_SONG), conns.pool);
const getSongList = db.mkQueryFromPool(db.mkQuery(GET_SONG_LIST), conns.pool);
const insertCheckoutBySong = db.mkQueryFromPool(db.mkQuery(INSERT_CHECKOUT_BY_SONG), conns.pool);
const getUsers = db.mkQueryFromPool(db.mkQuery(GET_USERS), conns.pool);
const updateAvailability = db.mkQueryFromPool(db.mkQuery(UPDATE_AVAILABILITY), conns.pool);

const app = express();

app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

app.use(morgan('tiny'));

// TODO - Task 3
// Song Upload
app.post('/api/song', upload.single('song'),
	(req, res) => {
		console.log('Song file: ', req.file);
		console.log('Body: ', req.body);

		res.on('finish', () => {
			fs.unlink(req.file.path, err => { });
		})

		const params = [
			req.body.title,
			req.file.filename,
			req.body.country,
			req.body.lyrics,
			req.body.slot,
			req.body.slot
		]

		conns.pool.getConnection((err, conn) => {
			db.startTransaction(conn)
				.then(replaceSong(params))
				.then(s3.uploadFile(
					req.file.path,
					{
						Bucket: 'paf-2019-example',
						Key: `songs/${req.file.originalname}`,
						ACL: 'public-read',
						ContentType: req.file.mimetype
					},
					conns.s3))
				.then(db.commit, db.rollback)
				.then(
					() => {
						res.status(201).type('json/application').json({
							status: 201,
							message: 'Created'
						})
					},
					() => {
						res.status(500).type('json/application').json({
							status: 500,
							message: 'Rollback'
						})
					}
				)
				.finally(() => {
					console.log('>> transaction completed')
					conn.release();
				})
		})

	}
)

app.get('/api/g/countries',
	(req, res) => {
		getCountries([])
			.then(result => {
				console.log('Result: ', result)
				res.status(200).type('application/json').json(result);
			})
			.catch(err => {
				console.error('Error: ', err)
				res.status(500).type('application/json').json({
					status: 500,
					message: err
				});
			})
	}
)


// TODO - Task 4
// List all songs 
app.get('/api/songs',
	(req, res) => {
		getSongList()
			.then(result => {
				console.log('Result: ', result)
				const data = result.map(v => {
					v.checked_out = v.slot - v.available;
					return v;
				})
				res.status(200).type('application/json').json(data);
			})
			.catch(err => {
				console.error('Error: ', err)
				res.status(500).type('application/json').json({
					status: 500,
					message: err
				});
			})
	}
)




// TODO - Task 5
// List available songs for listening
app.get('/api/users', (req, res) => {
	getUsers()
		.then(result => {
			res.status(200).type('application/json').json(result);
		})
		.catch(err => {
			console.error('Error: ', err)
			res.status(500).type('application/json').json({
				status: 500,
				message: err
			});
		})
})

// TODO - Task 6
// Listening a song

app.get('/api/song/checkout', (req, res) => {
	const country_code = req.query.country_code;
	const user_id = req.query.user_id;

	console.log('query: ', req.query.user_id);

	conns.pool.getConnection((err, conn) => {
		db.startTransaction(conn)
			.then(insertCheckoutBySong([country_code, user_id]))
			.then(updateAvailability([1, country_code]))
			.then(db.commit, db.rollback)
			.then(
				() => {
					res.status(200).type('json/application').json({
						status: 200,
						message: 'Subscribed'
					})
				},
				() => {
					res.status(500).type('json/application').json({
						status: 500,
						message: 'Rollback'
					})
				}
			)
			.finally(() => {
				conn.release()
			})
	})
})

testConnection(conns)
	.then(_ => {
		app.listen(PORT,
			() => {
				console.info(`Application started on ${PORT} at ${(new Date()).toString()}`);
			}
		)
	})
	.catch(err => {
		console.log('Error: ', err);
	})

