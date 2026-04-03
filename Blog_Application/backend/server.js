const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const app = require("./app");
const connectDB = require("./config/db");
const seedSuperAdmin = require("./utils/seedSuperAdmin");

connectDB().then(() => {
  seedSuperAdmin();
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});