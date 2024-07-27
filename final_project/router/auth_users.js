const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Array to store users with their credentials

const JWT_SECRET = "my_super_secret_key"; // Set your JWT secret here

const isValid = (username) => {
  // Check if the username already exists
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  // Check if username and password match the records
  const user = users.find((user) => user.username === username);
  if (user) {
    return bcrypt.compareSync(password, user.password); // Compare hashed passwords
  }
  return false;
};

// Task 6: Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (isValid(username)) {
      res.status(400).json({ message: "Username already exists" });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      users.push({ username, password: hashedPassword });
      res.status(201).json({ message: "User registered successfully" });
    }
  } else {
    res.status(400).json({ message: "Username and password are required" });
  }
});

// Task 7: Login a user
regd_users.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
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
  const { review } = req.body; // review should be in the body for x-www-form-urlencoded
  const token = req.headers["authorization"];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const username = decoded.username;
      if (books[isbn]) {
        if (!books[isbn].reviews) {
          books[isbn].reviews = [];
        }
        const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
        if (existingReviewIndex > -1) {
          books[isbn].reviews[existingReviewIndex].review = review;
        } else {
          books[isbn].reviews.push({ username, review });
        }
        res.status(200).json({ message: "Review added/updated successfully" });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});




// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.headers["authorization"];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const username = decoded.username;
      if (books[isbn]) {
        if (books[isbn].reviews) {
          books[isbn].reviews = books[isbn].reviews.filter(r => r.username !== username);
          res.status(200).json({ message: "Review deleted successfully" });
        } else {
          res.status(404).json({ message: "No reviews found for this book" });
        }
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports.authenticated = regd_users;
