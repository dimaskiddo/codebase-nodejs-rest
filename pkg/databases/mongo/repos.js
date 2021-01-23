const validate = require('validate.js')

const database = require('./dbs')

const common = require('../../utils/common')
const log = require('../../utils/logger')


// -------------------------------------------------
// DB Find Function
async function find(coll, params, sort, limit, page) {
  let ctx = 'mongo-repo-find'

  try {
    let dbConnection = database.getConnection()

    let paramsSort = {}
    paramsSort[sort] = 1
    
    let paramsPage = limit * (page - 1)

    let recordSet = await dbConnection.collection(coll).find(params).sort(paramsSort).limit(limit).skip(paramsPage).toArray()

    if (validate.isEmpty(recordSet)) {
      log.warn(ctx, 'Empty RecordSet Data')
      return
    }
    
    return recordSet
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    return
  }
}


// -------------------------------------------------
// DB FindOne Function
async function findOne(coll, params) {
  let ctx = 'mongo-repo-find-one'

  try {
    let dbConnection = database.getConnection()
    let recordSet = await dbConnection.collection(coll).findOne(params)

    if (validate.isEmpty(recordSet)) {
      log.warn(ctx, 'Empty RecordSet Data')
      return
    }

    return recordSet
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    return
  }
}


// -------------------------------------------------
// DB FindAll Function
async function findAll(coll, params) {
  let ctx = 'mongo-repo-find-all'

  try {
    let dbConnection = database.getConnection()
    let recordSet = await dbConnection.collection(coll).find(params).toArray()

    if (validate.isEmpty(recordSet)) {
      log.warn(ctx, 'Empty RecordSet Data')
      return
    }

    return recordSet
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    return
  }
}


// -------------------------------------------------
// DB InsertOne Function
async function insertOne(coll, data) {
  let ctx = 'mongo-repo-insert-one'

  try {
    let dbConnection = database.getConnection()
    let recordSet = await dbConnection.collection(coll).insertOne(data)

    if (recordSet.result.n != 1) {
      log.error(ctx, 'Failed to Insert Data')
      return false
    }

    return true
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    return false
  }
}


// -------------------------------------------------
// DB InsertAll Function
async function insertAll(coll, data) {
  let ctx = 'mongo-repo-insert-all'

  try {
    let dbConnection = database.getConnection()
    let recordSet = await dbConnection.collection(coll).insertMany(data)

    if (recordSet.result.n < 1) {
      log.error(ctx, 'Failed to Insert Data')
      return false
    }

    return true
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    return false
  }  
}

// -------------------------------------------------
// DB UpdateOne Function
async function updateOne(coll, params, query) {
  let ctx = 'mongo-repo-update-one'

  try {
    let dbConnection = database.getConnection()
    let recordSet = await dbConnection.collection(coll).update(params, query, { upsert: true })

    if (recordSet.result.nModified < 0) {
      log.error(ctx, 'Failed to Update Data')
      return false
    }

    return true
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
    return false
  }
}


// -------------------------------------------------
// DB CountData Function
async function countData(coll, params) {
  let ctx = 'mongo-repo-count-data'

  try {
    let dbConnection = database.getConnection()
    let recordSet = await dbConnection.collection(coll).count(params)

    if (validate.isEmpty(recordSet)) {
      log.warn(ctx, 'Empty RecordSet Data')
      return
    }

    return recordSet
  } catch(err) {
    log.error(ctx, common.strToTitleCase(err.message))
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
