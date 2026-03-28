const STORAGE_KEY = 'BOOKSHELF_APPS';

/** @type {{id:number,title:string,author:string,year:number,isComplete:boolean}[]} */
let books = [];

let editingBookId = null;
let activeSearchQuery = '';

function isStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function saveBooks() {
  if (!isStorageAvailable()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooks() {
  if (!isStorageAvailable()) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((b) => ({
        id: Number(b.id),
        title: String(b.title ?? ''),
        author: String(b.author ?? ''),
        year: Number(b.year),
        isComplete: Boolean(b.isComplete),
      }))
      .filter((b) => Number.isFinite(b.id) && b.title && b.author && Number.isFinite(b.year));
  } catch {
    return [];
  }
}

function getElements() {
  const bookForm = document.getElementById('bookForm');
  const bookFormTitleInput = document.getElementById('bookFormTitle');
  const bookFormAuthorInput = document.getElementById('bookFormAuthor');
  const bookFormYearInput = document.getElementById('bookFormYear');
  const bookFormIsCompleteCheckbox = document.getElementById('bookFormIsComplete');
  const bookFormSubmitButton = document.getElementById('bookFormSubmit');

  const searchBookForm = document.getElementById('searchBook');
  const searchBookTitleInput = document.getElementById('searchBookTitle');

  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  if (
    !bookForm ||
    !bookFormTitleInput ||
    !bookFormAuthorInput ||
    !bookFormYearInput ||
    !bookFormIsCompleteCheckbox ||
    !bookFormSubmitButton ||
    !searchBookForm ||
    !searchBookTitleInput ||
    !incompleteBookList ||
    !completeBookList
  ) {
    throw new Error('Required DOM elements are missing.');
  }

  return {
    bookForm,
    bookFormTitleInput,
    bookFormAuthorInput,
    bookFormYearInput,
    bookFormIsCompleteCheckbox,
    bookFormSubmitButton,
    searchBookForm,
    searchBookTitleInput,
    incompleteBookList,
    completeBookList,
  };
}

function updateSubmitButtonLabel() {
  const { bookFormIsCompleteCheckbox, bookFormSubmitButton } = getElements();
  const span = bookFormSubmitButton.querySelector('span');
  if (!span) return;
  span.textContent = bookFormIsCompleteCheckbox.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
}

function createBookItemElement(book) {
  const container = document.createElement('div');
  container.setAttribute('data-bookid', String(book.id));
  container.setAttribute('data-testid', 'bookItem');

  const titleEl = document.createElement('h3');
  titleEl.setAttribute('data-testid', 'bookItemTitle');
  titleEl.textContent = book.title;

  const authorEl = document.createElement('p');
  authorEl.setAttribute('data-testid', 'bookItemAuthor');
  authorEl.textContent = `Penulis: ${book.author}`;

  const yearEl = document.createElement('p');
  yearEl.setAttribute('data-testid', 'bookItemYear');
  yearEl.textContent = `Tahun: ${book.year}`;

  const buttonWrapper = document.createElement('div');

  const isCompleteButton = document.createElement('button');
  isCompleteButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  isCompleteButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  isCompleteButton.addEventListener('click', () => {
    toggleBookComplete(book.id);
  });

  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.addEventListener('click', () => {
    deleteBook(book.id);
  });

  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.textContent = 'Edit Buku';
  editButton.addEventListener('click', () => {
    startEditingBook(book.id);
  });

  buttonWrapper.append(isCompleteButton, deleteButton, editButton);
  container.append(titleEl, authorEl, yearEl, buttonWrapper);
  return container;
}

function normalizeQuery(query) {
  return String(query ?? '').trim().toLowerCase();
}

function getFilteredBooks() {
  const q = normalizeQuery(activeSearchQuery);
  if (!q) return books;
  return books.filter((b) => normalizeQuery(b.title).includes(q));
}

function renderBooks() {
  const { incompleteBookList, completeBookList } = getElements();
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const filtered = getFilteredBooks();
  for (const book of filtered) {
    const el = createBookItemElement(book);
    if (book.isComplete) completeBookList.appendChild(el);
    else incompleteBookList.appendChild(el);
  }
}

function generateId() {
  return Date.now();
}

function addBook({ title, author, year, isComplete }) {
  const book = {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };
  books.push(book);
  saveBooks();
  renderBooks();
}

function updateBook(updatedBook) {
  const idx = books.findIndex((b) => b.id === updatedBook.id);
  if (idx === -1) return;
  books[idx] = { ...books[idx], ...updatedBook };
  saveBooks();
  renderBooks();
}

function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  if (editingBookId === bookId) editingBookId = null;
  saveBooks();
  renderBooks();
}

function toggleBookComplete(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;
  book.isComplete = !book.isComplete;
  saveBooks();
  renderBooks();
}

function startEditingBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;
  const {
    bookFormTitleInput,
    bookFormAuthorInput,
    bookFormYearInput,
    bookFormIsCompleteCheckbox,
    bookForm,
  } = getElements();

  editingBookId = bookId;
  bookFormTitleInput.value = book.title;
  bookFormAuthorInput.value = book.author;
  bookFormYearInput.value = String(book.year);
  bookFormIsCompleteCheckbox.checked = book.isComplete;
  updateSubmitButtonLabel();
  bookForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearForm() {
  const {
    bookFormTitleInput,
    bookFormAuthorInput,
    bookFormYearInput,
    bookFormIsCompleteCheckbox,
  } = getElements();

  bookFormTitleInput.value = '';
  bookFormAuthorInput.value = '';
  bookFormYearInput.value = '';
  bookFormIsCompleteCheckbox.checked = false;
  updateSubmitButtonLabel();
}

function handleBookFormSubmit(event) {
  event.preventDefault();

  const {
    bookFormTitleInput,
    bookFormAuthorInput,
    bookFormYearInput,
    bookFormIsCompleteCheckbox,
  } = getElements();

  const title = bookFormTitleInput.value.trim();
  const author = bookFormAuthorInput.value.trim();
  const year = Number(bookFormYearInput.value);
  const isComplete = bookFormIsCompleteCheckbox.checked;

  if (!title || !author || !Number.isFinite(year)) return;

  if (editingBookId !== null) {
    updateBook({
      id: editingBookId,
      title,
      author,
      year,
      isComplete,
    });
    editingBookId = null;
  } else {
    addBook({ title, author, year, isComplete });
  }

  clearForm();
}

function handleSearchSubmit(event) {
  event.preventDefault();
  const { searchBookTitleInput } = getElements();
  activeSearchQuery = searchBookTitleInput.value;
  renderBooks();
}

function init() {
  const {
    bookForm,
    bookFormIsCompleteCheckbox,
    searchBookForm,
    incompleteBookList,
    completeBookList,
  } = getElements();

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books = loadBooks();
  updateSubmitButtonLabel();
  renderBooks();

  bookForm.addEventListener('submit', handleBookFormSubmit);
  bookFormIsCompleteCheckbox.addEventListener('change', updateSubmitButtonLabel);
  searchBookForm.addEventListener('submit', handleSearchSubmit);
}

document.addEventListener('DOMContentLoaded', init);
