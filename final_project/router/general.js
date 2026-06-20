const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Đăng ký người dùng mới
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!users.find(u => u.username === username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Lấy danh sách tất cả sách sử dụng Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getAllBooks = () => Promise.resolve(books);
    const bookList = await getAllBooks();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Lấy thông tin sách dựa trên ISBN sử dụng Async/Await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const getBookByISBN = (id) => {
      return new Promise((resolve, reject) => {
        if (books[id]) resolve(books[id]);
        else reject("Book not found");
      });
    };
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
  
// Task 12: Lấy thông tin sách dựa trên Tác giả sử dụng Async/Await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = (authorName) => {
      return new Promise((resolve) => {
        const filteredBooks = Object.keys(books)
          .filter(id => books[id].author.toLowerCase() === authorName.toLowerCase())
          .map(id => ({ isbn: id, ...books[id] }));
        resolve(filteredBooks);
      });
    };
    const results = await getBooksByAuthor(author);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Error parsing data" });
  }
});

// Task 13: Lấy thông tin sách dựa trên Tiêu đề sử dụng Async/Await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooksByTitle = (bookTitle) => {
      return new Promise((resolve) => {
        const filteredBooks = Object.keys(books)
          .filter(id => books[id].title.toLowerCase() === bookTitle.toLowerCase())
          .map(id => ({ isbn: id, ...books[id] }));
        resolve(filteredBooks);
      });
    };
    const results = await getBooksByTitle(title);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: "Error parsing data" });
  }
});

// Lấy thông tin review sách dựa trên ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports = public_users;
