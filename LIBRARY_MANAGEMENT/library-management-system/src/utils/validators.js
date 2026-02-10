export const validateBook = ({ title, author, isbn }) => {
  const errors = {};
  if (!title || title.length < 3) errors.title = "Title must be at least 3 chars";
  if (!author) errors.author = "Author is required";
  if (!isbn || isbn.length !== 13 || !/^\d+$/.test(isbn))
    errors.isbn = "ISBN must be 13 digits";
  return errors;
};
