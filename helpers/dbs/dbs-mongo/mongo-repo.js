const validate = require('validate.js');
const database = require('./mongo-db')
const log = require('../../utils/utils-logger')


// -------------------------------------------------
// DB Create Connection Function
if (database.conn === undefined) {
  database.getConnection()
}


// -------------------------------------------------
// DB Find Function
async function find(coll, params, sort, limit, page) {
  try {
    let paramsSort = {}
        paramsSort[sort] = 1
    let paramsPage = limit * (page - 1)

    let recordSet = await database.conn.collection(coll).find(params).sort(paramsSort).limit(limit).skip(paramsPage).toArray()

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find').warn("Empty RecordSet Data")
      return
    }
    return recordSet
  } catch(err) {
    log.send('mongo-repo-find').error("Cannot Get RecordSet Data")
    return
  }
}


// -------------------------------------------------
// DB FindOne Function
async function findOne(coll, params) {
  try {
    let recordSet = await database.conn.collection(coll).findOne(params)

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find-one').warn("Empty RecordSet Data")
      return
    }
    return recordSet
  } catch(err) {
    log.send('mongo-repo-find-one').error("Cannot Get RecordSet Data")
    return
  }
}


// -------------------------------------------------
// DB FindAll Function
async function findAll(coll, params) {
  try {
    let recordSet = await database.conn.collection(coll).find(params).toArray()

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find-all').warn("Empty RecordSet Data")
      return
    }
    return recordSet
  } catch(err) {
    log.send('mongo-repo-find-all').error("Cannot Get RecordSet Data")
    return
  }
}


// -------------------------------------------------
// DB InsertOne Function
async function insertOne(coll, data) {
  try {
    let recordSet = await database.conn.collection(coll).insertOne(data)

    if (recordSet.result.n != 1) {
      log.send('mongo-repo-insert-one').error("Failed to Insert Data")
      return false
    }
    return true
  } catch(err) {
    log.send('mongo-repo-insert-one').error("Failed to Insert Data")
    return false
  }
}


// -------------------------------------------------
// DB InsertAll Function
async function insertAll(coll, data) {
  try {
    let recordSet = await database.conn.collection(coll).insertMany(data)

    if (recordSet.result.n < 1) {
      log.send('mongo-repo-insert-all').error("Failed to Insert Data")
      return false
    }
    return true
  } catch(err) {
    log.send('mongo-repo-insert-all').error("Failed to Insert Data")
    return false
  }  
}

// -------------------------------------------------
// DB UpdateOne Function
async function updateOne(coll, params, query) {
  try {
    let recordSet = await database.conn.collection(coll).update(params, query, { upsert: true})

    if (recordSet.result.nModified < 0) {
      log.send('mongo-repo-update-one').error("Failed to Update Data")
      return false
    }
    return true
  } catch(err) {
    log.send('mongo-repo-update-one').error("Failed to Update Data")
    return false
  }
}


// -------------------------------------------------
// DB CountData Function
async function countData(coll, params) {
  try {
    let recordSet = await database.conn.collection(coll).count(params)

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-count-data').warn("Empty RecordSet Data")
      return
    }
    return recordSet
  } catch(err) {
    log.send('mongo-repo-count-data').error("Cannot Get RecordSet Data")
    return
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  find,
  findOne,
  findAll,
  insertOne,
  insertAll,
  updateOne,
  countData
}
