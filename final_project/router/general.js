const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
};

const getByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
      let numISBN = parseInt(isbn);
      if(books[numISBN]){
        resolve(books[numISBN]);
      }
      else{
        reject({status: 404, message: 'ISBM ${isbn} not found'})
      }
  });
};

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });

});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  //res.send(JSON.stringify(books,null,4));
  try {
    const bookList = await getBooks(); 
    res.json(bookList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  getByISBN(req.params.isbn).then(result => res.send(result), error => res.status(error.status).json({message: error.message}));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const bAuthor = req.params.author;
  getBooks().then((b) => Object.values(b)).then(books => books.filter(book => book.author === bAuthor)).then(booksByAuthor => res.send(booksByAuthor));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const bTitle = req.params.title;
  getBooks().then((b) => Object.values(b)).then(books => books.filter(book => book.title === bTitle)).then(booksByTitle => res.send(booksByTitle));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  getByISBN(req.params.isbn).then(result => res.send(result.reviews), error => res.status(error.status).json({message: error.message}));
});

module.exports.general = public_users;
