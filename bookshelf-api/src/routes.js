const express = require('express')
const router = express.Router()
const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
} = require('./handler')

router.post('/books', addBookHandler)
router.get('/books', getAllBooksHandler)
router.get('/books/:bookId', getBookByIdHandler)
router.put('/books/:bookId', editBookByIdHandler)
router.delete('/books/:bookId', deleteBookByIdHandler)

module.exports = router
