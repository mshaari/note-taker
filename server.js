// Node module requirements
const express = require('express');
const path = require('path');
const fs = require("fs");

// Set port to use with express (compatible with Heroku) and initialize express
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and URL encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up access to our public folder
app.use(express.static('public'));

// Link to the routes file that has the routes
require('./routes/routes.js')(app);

// Listener that logs to console the port
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));