const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get the list of books available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Simulate a network request to get the list of books
    const response = await axios.get('http://localhost:5000'); // Assuming your API is running on localhost:5000
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books" });
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    // Simulate a network request to get book details
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    if (response.data) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch book details" });
  }
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  try {
    // Simulate a network request to get book details by author
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    if (response.data.length > 0) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books by author" });
  }
});

// Task 13: Get book details based on Title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  try {
    // Simulate a network request to get book details by title
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    if (response.data.length > 0) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch books by title" });
  }
});

module.exports.general = public_users;
