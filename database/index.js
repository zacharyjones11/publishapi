const { MongoClient } = require('mongodb');

let db;

const initDb = async () => {
  if (db) {
    return db;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  db = client.db('publishapi');

  console.log('Connected to MongoDB');

  return db;
};

const getDb = () => {
  return db;
};

module.exports = {
  initDb,
  getDb
};