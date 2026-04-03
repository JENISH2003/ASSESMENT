import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center mt-20">
    <h1 className="text-6xl font-bold">404</h1>
    <p className="text-gray-600 mt-4">Page not found</p>
    <Link to="/" className="text-blue-500 hover:underline mt-4 block">Go Home</Link>
  </div>
);

export default NotFound;