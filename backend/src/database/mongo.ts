import MongoClient from "mongodb";

async function connect() {
  const db = await MongoClient.connect(process.env.DATABASE_URL);

  console.log(db);
}

connect();
