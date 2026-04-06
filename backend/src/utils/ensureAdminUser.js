const User = require("../models/User");

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@clinic.com";
  const existing = await User.findOne({ email });

  if (existing) {
    return { created: false, email };
  }

  await User.create({
    name: process.env.ADMIN_NAME || "System Admin",
    email,
    password: process.env.ADMIN_PASSWORD || "Admin@123",
    role: "admin",
  });

  return { created: true, email };
};

module.exports = ensureAdminUser;
