const { nanoid } = require('nanoid')
const books = require('./books')

const toBooleanFlag = (value) => value === true || value === 1 || value === '1'

const toNumberValue = (value) => Number(value)

const addBookHandler = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.body

  const pageCountNumber = toNumberValue(pageCount)
  const readPageNumber = toNumberValue(readPage)
  const readingFlag = toBooleanFlag(reading)

  // Kriteria: Nama tidak boleh kosong
  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
  }

  // Kriteria: readPage tidak boleh lebih besar dari pageCount
  if (readPageNumber > pageCountNumber) {
    return res.status(400).json({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  const id = nanoid(16)
  const finished = pageCountNumber === readPageNumber
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount: pageCountNumber,
    readPage: readPageNumber,
    finished,
    reading: readingFlag,
    insertedAt,
    updatedAt
  }

  books.push(newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    return res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
}

const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query
  let filteredBooks = books

  // Filter berdasarkan Nama (Non-case sensitive)
  if (name) {
    filteredBooks = filteredBooks.filter((b) =>
      b.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  // Filter berdasarkan status Reading
  if (reading !== undefined) {
    const readingFilter = toNumberValue(reading)
    filteredBooks = filteredBooks.filter(
      (b) => toNumberValue(b.reading) === readingFilter
    )
  }

  // Filter berdasarkan status Finished
  if (finished !== undefined) {
    const finishedFilter = toNumberValue(finished)
    filteredBooks = filteredBooks.filter(
      (b) => toNumberValue(b.finished) === finishedFilter
    )
  }

  // Pastikan hanya mengirimkan properti id, name, dan publisher sesuai kriteria
  const result = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  return res.status(200).json({
    status: 'success',
    data: {
      books: result
    }
  })
}

const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params
  const book = books.find((b) => b.id === bookId)

  if (book) {
    return res.status(200).json({
      status: 'success',
      data: {
        book
      }
    })
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
}

const editBookByIdHandler = (req, res) => {
  const { bookId } = req.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.body
  const updatedAt = new Date().toISOString()
  const pageCountNumber = toNumberValue(pageCount)
  const readPageNumber = toNumberValue(readPage)
  const readingFlag = toBooleanFlag(reading)

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
  }

  if (readPageNumber > pageCountNumber) {
    return res.status(400).json({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
  }

  const index = books.findIndex((b) => b.id === bookId)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount: pageCountNumber,
      readPage: readPageNumber,
      reading: readingFlag,
      finished: pageCountNumber === readPageNumber,
      updatedAt
    }

    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
}

const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params
  const index = books.findIndex((b) => b.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    return res.status(200).json({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
  }

  return res.status(404).json({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
