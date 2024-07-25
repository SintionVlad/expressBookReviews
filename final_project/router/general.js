const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Task 10: Get the list of books available in the shop
public_users.get('/', function (req, res) {
  res.json(books);
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 12: Get book details based on Author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(b => b.author === author);
  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 13: Get book details based on Title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const booksByTitle = Object.values(books).filter(b => b.title === title);
  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

module.exports.general = public_users;
