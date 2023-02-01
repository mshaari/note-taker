const fs = require('fs');
const path = require('path');
var uniqueId = require('generate-unique-id');

module.exports = app => {
    fs.readFile("db/db.json", 'utf8', (err, data) => {

        if (err) throw (err);

        var notes = JSON.parse(data);

        function refreshDb() {
            fs.writeFile('db/db.json', JSON.stringify(notes, null, '\t'), (err) => {
                if (err) throw (err);
                return true;
            });
        };

        app.get('/api/notes', function(req, res) {
            res.json(notes);

            refreshDb();

            // Log our request to the terminal
            console.info(`${req.method} request received to get reviews`);
        });

        app.post('/api/notes', function(req, res) {
            var newNote = {
                title: req.body.title,
                text: req.body.text,
                id: uniqueId(), //Use npm package
              };
            console.log(newNote);
            notes.push(newNote); //is this how we add it to the json file?? which package do we use to assign the unique id to each note?
            refreshDb();
            res.json(notes);
        });

        app.get('/api/notes/:id', function(req, res) {
            res.json(notes[req.params.id]); //captures the id parameters from our request and goes to that element in the notes array
        });

        app.delete('/api/notes/:id', function(req, res) {
            notes.splice(req.params.id, 1); //WHAT DOES THIS MEAN?
            refreshDb();
            res.json(notes);
            console.log(`Note with id = ${req.params.id} has been deleted.`);
        });
        
        app.get('/notes', function(req, res) {
            res.sendFile(path.join(__dirname, '../public/notes.html')); //if this doesnt work change __dirname to "cwd" (method)
        });

        //this has to go at the bottom, right
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

    });
}