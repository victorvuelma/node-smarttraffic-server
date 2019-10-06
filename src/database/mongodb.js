const MongoClient = require('mongodb').MongoClient

const connect = async () => {
  const conn = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true })

  await conn.connect()

  return conn
}

const insert = async (col, payload) => {
  const conn = await connect()

  const db = await conn.db('smarttraffic')

  const collection = await db.collection(col)

  await collection.insertOne(payload)

  conn.close()
}

module.exports = {
  connect,
  insert
}
