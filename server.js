// Import express, fs, and path
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API routes
// GET '/api/notes' will read the db.json data and return as response
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }

    let notes;
    try {
      notes = JSON.parse(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to parse notes data.' });
    }

    res.json(notes);
  });
});

// POST '/api/notes' will add new note to db.json
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required fields.' });
  }

  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }

    let notes;
    try {
      notes = JSON.parse(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to parse notes data.' });
    }

    // generate a unique id for db.json data
    const newNote = {
        id: Date.now().toString(), 
        title,
        text
      };
      

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), 'utf8', err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note.' });
      }

      res.json(newNote);
    });
  });
});

// DELETE /api/notes/:id route
app.delete('/api/notes/:id', (req, res) => {

  const noteId = parseInt(req.params.id);

  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes data.' });
    }

    let notes;
    try {
      notes = JSON.parse(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to parse notes data.' });
    }
    const updatedNotes = notes.filter(note => note.id != noteId);

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(updatedNotes), 'utf8', err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete note.' });
      }

      res.json({ message: 'Note deleted successfully.' });
    });
  });
});

// notes.html route
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// start the server
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
  });