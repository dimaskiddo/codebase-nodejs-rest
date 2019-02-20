const validate = require('validate.js')
const database = require('./mongo-db').getConnection()
const common = require('../../utils/utils-common')
const log = require('../../utils/utils-logger')


// -------------------------------------------------
// DB Find Function
async function find(coll, params, sort, limit, page) {
  try {
    let paramsSort = {}
        paramsSort[sort] = 1
    let paramsPage = limit * (page - 1)

    let recordSet = await database.collection(coll).find(params).sort(paramsSort).limit(limit).skip(paramsPage).toArray()

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find').warn("Empty RecordSet Data")
      return
    }
    return recordSet
  } catch(err) {
    log.send('mongo-repo-find').error(common.strToTitleCase(err.message))
    return
  }
}


// -------------------------------------------------
// DB FindOne Function
async function findOne(coll, params) {
  try {
    let recordSet = await database.collection(coll).findOne(params)

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find-one').warn("Empty RecordSet Data")
      return
    }
    return recordSet
  } catch(err) {
    log.send('mongo-repo-find-one').error(common.strToTitleCase(err.message))
    return
  }
}


// -------------------------------------------------
// DB FindAll Function
async function findAll(coll, params) {
  try {
    let recordSet = await database.collection(coll).find(params).toArray()

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find-all').warn("Empty RecordSet Data")
      return
    }
    return recordSet
  } catch(err) {
    log.send('mongo-repo-find-all').error(common.strToTitleCase(err.message))
    return
  }
}


// -------------------------------------------------
// DB InsertOne Function
async function insertOne(coll, data) {
  try {
    let recordSet = await database.collection(coll).insertOne(data)

    if (recordSet.result.n != 1) {
      log.send('mongo-repo-insert-one').error("Failed to Insert Data")
      return false
    }
    return true
  } catch(err) {
    log.send('mongo-repo-insert-one').error(common.strToTitleCase(err.message))
    return false
  }
}


// -------------------------------------------------
// DB InsertAll Function
async function insertAll(coll, data) {
  try {
    let recordSet = await database.collection(coll).insertMany(data)

    if (recordSet.result.n < 1) {
      log.send('mongo-repo-insert-all').error("Failed to Insert Data")
      return false
    }
    return true
  } catch(err) {
    log.send('mongo-repo-insert-all').error(common.strToTitleCase(err.message))
    return false
  }  
}

// -------------------------------------------------
// DB UpdateOne Function
async function updateOne(coll, params, query) {
  try {
    let recordSet = await database.collection(coll).update(params, query, { upsert: true})

    if (recordSet.result.nModified < 0) {
      log.send('mongo-repo-update-one').error("Failed to Update Data")
      return false
    }
    return true
  } catch(err) {
    log.send('mongo-repo-update-one').error(common.strToTitleCase(err.message))
    return false
  }
}


// -------------------------------------------------
// DB CountData Function
async function countData(coll, params) {
  try {
    let recordSet = await database.collection(coll).count(params)

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-count-data').warn("Empty RecordSet Data")
      return
    }
    return recordSet
  } catch(err) {
    log.send('mongo-repo-count-data').error(common.strToTitleCase(err.message))
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
