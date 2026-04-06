require("dotenv").config();
const connectDB = require("../config/db");
const ensureAdminUser = require("./ensureAdminUser");

const seedAdmin = async () => {
  try {
    await connectDB();
    const { created } = await ensureAdminUser();

    if (!created) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin", error.message);
    process.exit(1);
  }
};

seedAdmin();
