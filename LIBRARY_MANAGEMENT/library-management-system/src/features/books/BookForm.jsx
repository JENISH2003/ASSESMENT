import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "./booksSlice";
import { createBook } from "../../api/booksApi";
import { validateBook } from "../../utils/validators";
import Button from "../../components/Button";

const BookForm = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    genre: "",
    status: "Available",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateBook(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    const res = await createBook(form);
    dispatch(addBook(res.data));
    setForm({ title: "", author: "", isbn: "", genre: "", status: "Available" });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 rounded"/>
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} className="border p-2 rounded"/>
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} className="border p-2 rounded"/>
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} className="border p-2 rounded"/>
      </div>
      <Button type="submit">Add Book</Button>
    </form>
  );
};

export default BookForm;
