const express = require('express');
const path = require('path');
const fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

// Link to the routes file
require('./routes/routes')(app);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));