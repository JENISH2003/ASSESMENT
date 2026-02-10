import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBooks, deleteBook } from "./booksSlice";
import { getBooks, removeBook } from "../../api/booksApi";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import EditBookModal from "../books/EditBookModel"; // ✅ correct relative path

const BooksList = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);

  // Fetch books on load
  useEffect(() => {
    getBooks().then((res) => dispatch(setBooks(res.data)));
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    await removeBook(id);
    dispatch(deleteBook(id));
  };

  // Search filter
  const filtered = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination (10 per page)
  const paginated = filtered.slice((page - 1) * 10, page * 10);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Books List</h2>

      <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Author</th>
            <th className="border p-2">Genre</th>
            <th className="border p-2">ISBN</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((book) => (
            <tr key={book.id}>
              <td className="border p-2">{book.title}</td>
              <td className="border p-2">{book.author}</td>
              <td className="border p-2">{book.genre}</td>
              <td className="border p-2">{book.isbn}</td>
              <td className="border p-2">{book.status}</td>
              <td className="border p-2 flex gap-2">
                <Button onClick={() => setSelectedBook(book)}>Edit</Button>
                <Button onClick={() => handleDelete(book.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination total={filtered.length} currentPage={page} onPageChange={setPage} />

      {/* Edit Modal */}
      <EditBookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
};

export default BooksList;
