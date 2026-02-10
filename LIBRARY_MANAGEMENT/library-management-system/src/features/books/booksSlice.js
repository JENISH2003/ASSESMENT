import { createSlice } from "@reduxjs/toolkit";

const initialState = { books: [] };

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action) => { state.books = action.payload },
    addBook: (state, action) => { state.books.push(action.payload) },
    updateBook: (state, action) => {
      state.books = state.books.map(book =>
        book.id === action.payload.id ? action.payload : book
      );
    },
    deleteBook: (state, action) => {
      state.books = state.books.filter(b => b.id !== action.payload);
    },
  },
});

export const { setBooks, addBook, updateBook, deleteBook } = booksSlice.actions;
export default booksSlice.reducer;
