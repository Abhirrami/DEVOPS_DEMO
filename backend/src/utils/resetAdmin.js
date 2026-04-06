require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

const resetAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@clinic.com";
    const name = process.env.ADMIN_NAME || "System Admin";
    const password = process.env.ADMIN_PASSWORD || "Admin@123";

    let admin = await User.findOne({ email });

    if (!admin) {
      admin = new User({
        name,
        email,
        password,
        role: "admin",
        isActive: true,
      });
    } else {
      admin.name = name;
      admin.password = password;
      admin.role = "admin";
      admin.isActive = true;
    }

    await admin.save();
    console.log(`Admin credentials reset for ${email}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to reset admin", error.message);
    process.exit(1);
  }
};

resetAdmin();
