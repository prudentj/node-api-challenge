//imports
const express = require('express');
const projectRouter = require('./projectsRouter');
const actionsRouter = require('./actionsRouter');
const cors = require('cors');
const server = express();

//global middleware
server.use(express.json());
server.use(cors());

//routes-endpoints
server.use('/api/projects', logger, projectRouter);
server.use('/api/actions', logger, actionsRouter);
server.get('/', (req, res) => {
	res.send(`<h2>The server is online and happy to see you!</h2>`);
});

//local middleware
function logger(req, res, next) {
	// logs to the console the following information about each request: request method, request url, and a timestamp
	//  runs on every request made to the API
	console.log(
		`@time ${Date.now()} : ${req.method} Request to ${req.originalUrl}`
	);
	next();
}

module.exports = server;
