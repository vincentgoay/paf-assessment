const fs = require('fs');
const { join } = require('path');
const uuid = require('uuid');
const express = require('express');
const hbs = require('express-handlebars');
const morgan = require('morgan');
const multer = require('multer');

// TODO - Task 2
// Configure your databases
const { loadConfig, testConnection } = require('./initUtils');
let config;
if (fs.existsSync(__dirname + '/config.js')) {
	const config = require('./config');
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


const PORT = parseInt(process.argv[2] || process.env.PORT) || 3000;
const upload = multer({ dest: join(__dirname, 'tmp') });

const app = express();

app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

app.use(morgan('tiny'));

// TODO - Task 3
// Song Upload
app.post('/api/song', upload.single('song_mp3'),
	(req, res) => {
		res.status(201).type('application/json').json({
			status: 201,
			message: 'Song posted successfully'
		})
	}
)


// TODO - Task 4
// List all songs 


// TODO - Task 5
// List available songs for listening


// TODO - Task 6
// Listening a song


app.listen(PORT,
	() => {
		console.info(`Application started on ${PORT} at ${(new Date()).toString()}`);
	}
)
