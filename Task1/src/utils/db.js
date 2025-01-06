const { MongoClient } = require("mongodb");

let db;

const connectDB = async () => {
  if (db) return db;

  const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  db = client.db();
  console.log("Connected to MongoDB");
  return db;
};

module.exports = connectDB;
