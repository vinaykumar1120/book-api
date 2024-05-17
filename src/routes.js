const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all books
router.get('/books', (req, res) => {
  db.all('SELECT * FROM books', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ books: rows });
  });
});

// Get a single book by id
router.get('/books/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ book: row });
  });
});

// Create a new book
router.post('/books', (req, res) => {
  const { name, img, summary } = req.body;
  db.run('INSERT INTO books (name, img, summary) VALUES (?, ?, ?)', [name, img, summary], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Update a book
router.put('/books/:id', (req, res) => {
  const { name, img, summary } = req.body;
  const id = req.params.id;
  db.run('UPDATE books SET name = ?, img = ?, summary = ? WHERE id = ?', [name, img, summary, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// Delete a book
router.delete('/books/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

module.exports = router;
