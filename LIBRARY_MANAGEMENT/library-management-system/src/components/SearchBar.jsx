const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Search by title..."
    value={value}
    onChange={onChange}
    className="border p-2 rounded w-full mb-4"
  />
);

export default SearchBar;
