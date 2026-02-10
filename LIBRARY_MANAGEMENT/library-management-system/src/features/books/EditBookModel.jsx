import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { editBook } from "../../api/booksApi";
import { useDispatch } from "react-redux";
import { updateBook } from "./booksSlice";

const EditBookModal = ({ book, onClose }) => {
  const dispatch = useDispatch();

  // Safe initialization
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    status: "Available",
  });

  // When a book is selected, update the form
  useEffect(() => {
    if (book) setForm(book);
  }, [book]);

  // Do not render modal if no book is selected
  if (!book) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ send PUT request to JSON Server
    const res = await editBook(form.id, form);

    // ✅ update Redux store
    dispatch(updateBook(res.data));

    // close modal
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="genre"
          value={form.genre}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Available">Available</option>
          <option value="Borrowed">Borrowed</option>
        </select>
        <Button type="submit">Update Book</Button>
      </form>
    </Modal>
  );
};

export default EditBookModal;
