const express = require('express');
const server = express();

server.use(express.json());


//import routes
const actionRoute = require('./routes/action');
const projectRoute = require('./routes/projects');

//add middleware and env item
const question = process.env.PORT

//setup routes
server.use('/api/actions', actionRoute);
server.use('/api/projects', projectRoute);

//init get
server.get('/', (req, res) => {
  res.send( `"Running server on "${question}"` );
})

module.exports = server;