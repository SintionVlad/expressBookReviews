const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const public_users = express.Router();

// Task 1: Obține lista de cărți disponibile în magazin
public_users.get('/', function (req, res) {
  res.json(books);
});

// Task 2: Obține detaliile unei cărți pe baza ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    res.json(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Obține toate cărțile după autor
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const results = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if (results.length > 0) {
    res.json(results);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Obține toate cărțile după titlu
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const results = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  if (results.length > 0) {
    res.json(results);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 10: Obține lista de cărți folosind async/await cu Axios
public_users.get('/async', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:3333/');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Task 11: Obține detaliile unei cărți pe baza ISBN folosind async/await cu Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:3333/isbn/${isbn}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book details by ISBN" });
  }
});

// Task 12: Obține cărțile după autor folosind async/await cu Axios
public_users.get('/async/author/:author', async function (req, res) {
  const { author } = req.params;
  try {
    const response = await axios.get(`http://localhost:3333/author/${author}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books by author" });
  }
});

// Task 13: Obține cărțile după titlu folosind async/await cu Axios
public_users.get('/async/title/:title', async function (req, res) {
  const { title } = req.params;
  try {
    const response = await axios.get(`http://localhost:3333/title/${title}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books by title" });
  }
});

module.exports.general = public_users;
