const User = require("../models/User");

const seedSuperAdmin = async () => {
  try {
    const adminEmail = process.env.SUPERADMIN_EMAIL
    const adminPassword = process.env.SUPERADMIN_PASSWORD

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: "Superadmin",
        email: adminEmail,
        password: adminPassword,
        role: "superadmin",
        isVerified: true,
      });
      console.log("Static Super Admin created.");
    } else {
       // Make sure it has superadmin role if it was changed
       if (existingAdmin.role !== "superadmin") {
         existingAdmin.role = "superadmin";
         await existingAdmin.save();
         console.log("Updated static user to superadmin role.");
       }
    }
  } catch (error) {
    console.error("Error seeding super admin:", error);
  }
};

module.exports = seedSuperAdmin;
