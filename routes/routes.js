// Require node modules
const fs = require('fs');
const path = require('path');
var uniqueId = require('generate-unique-id');

// Export this (for use in server.js file)
module.exports = app => {
    // Read the db.json file
    fs.readFile("db/db.json", 'utf8', (err, data) => {

        // Error handling
        if (err) throw (err);

        // Parse the data returned from db.json and set to 'notes' variable
        var notes = JSON.parse(data);

        // Function to be called later to refresh the db.json file (write the updated 'notes' to it)
        function refreshDb() {
            fs.writeFile('db/db.json', JSON.stringify(notes, null, '\t'), (err) => {
                if (err) throw (err);
                return true;
            });
        };

        // API get route accessible through /api/notes 
        app.get('/api/notes', function(req, res) {
            // Return 'notes' as JSON 
            res.json(notes);

            // Log our request to the command line
            console.info(`${req.method} request received.`);
        });

        // API post route accessible through /api/notes
        app.post('/api/notes', function(req, res) {
            // Declare newNote with structure for title = req.body.title, text = req.body.text, and the id = a random ID generated by uniqueId
            var newNote = {
                title: req.body.title,
                text: req.body.text,
                id: uniqueId(), //Use npm package
            };
            // Push the newNote to 'notes'
            notes.push(newNote); 

            // Update db.json by calling earlier function
            refreshDb();

            // Return 'notes' as JSON
            res.json(notes);
            
            // Log our request to the command line
            console.info(`${req.method} request received. New note set with the following information: ${newNote}.`);
        });

        // API get route accessible through /api/notes/:id
        app.get('/api/notes/:id', function(req, res) {
            // Return the element in the notes array with the index of the id (by capturing the id parameter of the note from the request)
            res.json(notes[req.params.id]); 

            // Log our request to the command line
            console.info(`${req.method} request received. Note with id = ${req.params.id} has been selected.`);
        });

        // API delete route accessible through /api/notes/:id
        app.delete('/api/notes/:id', function(req, res) {
            // Deletes 1 element starting at the index of the id of the given note
            notes.splice(req.params.id, 1); 

            // Update db.json
            refreshDb();

            // Return 'notes' as JSON
            res.json(notes);

            // Log our request to the command line
            console.log(`Note with id = ${req.params.id} has been deleted.`);
        });
        
        // When the route /notes is visited, show notes.html
        app.get('/notes', function(req, res) {
            res.sendFile(path.join(__dirname, '../public/notes.html')); 
        });

        // When any other route is visited, show index.html
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
    });
}