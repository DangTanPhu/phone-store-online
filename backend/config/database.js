const mongoose = require('mongoose');
require('dotenv').config();

class Database {
  constructor() {
    if (!Database.instance) {
      this.connect();
      Database.instance = this;
    }
    return Database.instance;
  }

  async connect() {
    try {
      const uri = process.env.MONGO_URI;
      if (!uri) {
        throw new Error("MONGO_URI is not defined in .env file");
      }

      this.connection = await mongoose.connect(uri);
      console.log("MongoDB connected successfully!");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    }
  }

  getConnection() {
    return this.connection;
  }
}

const databaseInstance = new Database();
Object.freeze(databaseInstance); // Đảm bảo không thể thay đổi instance

module.exports = databaseInstance;