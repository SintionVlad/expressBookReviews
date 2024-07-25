const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Optional pentru criptarea parolelor
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Array to store users with their credentials

const isValid = (username) => { // returns boolean
  // Check if the username is valid (e.g., exists in the users array)
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { // returns boolean
  // Check if username and password match the records
  const user = users.find(user => user.username === username);
  if (user) {
    return bcrypt.compareSync(password, user.password); // Use bcrypt to compare hashed passwords
  }
  return false;
}

// Task 7: Complete the code for logging in as a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  if (username && password) {
    if (isValid(username) && authenticatedUser(username, password)) {
      // Generate a JWT token for the authenticated user
      const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
      req.session.token = token;
      res.status(200).json({ message: "Login successful", token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } else {
    res.status(400).json({ message: "Username and password are required" });
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const token = req.session.token;

  if (token) {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const username = decoded.username;

    if (books[isbn]) {
      if (!books[isbn].reviews) {
        books[isbn].reviews = [];
      }
      // Find and update or add a new review
      const existingReviewIndex = books[isbn].reviews.findIndex(review => review.username === username);
      if (existingReviewIndex > -1) {
        books[isbn].reviews[existingReviewIndex].review = review;
      } else {
        books[isbn].reviews.push({ username, review });
      }
      res.status(200).json({ message: "Review added/updated successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.session.token;

  if (token) {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const username = decoded.username;

    if (books[isbn]) {
      if (books[isbn].reviews) {
        // Filter out reviews that don't belong to the user
        books[isbn].reviews = books[isbn].reviews.filter(review => review.username !== username);
        res.status(200).json({ message: "Review deleted successfully" });
      } else {
        res.status(404).json({ message: "No reviews found for this book" });
      }
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
