import BookForm from "./features/books/BookForm";
import BooksList from "./features/books/BooksList";

const App = () => (
  <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-bold text-center mb-8">
      Library Management System
    </h1>
    <BookForm />
    <BooksList />
  </div>
);

export default App;
