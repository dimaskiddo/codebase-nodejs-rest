const validate = require('validate.js');
const database = require('./mongo-conn')
const common = require('../../utils/utils-common')
const logger = require('../../utils/utils-logger')


// -------------------------------------------------
// DB FindOne Variable
async function findOne(coll, params) {
  try {
    let recordSet = await database.conn.collection(coll).findOne(params)

    if (validate.isEmpty(recordSet)) {
      logger.fmt.warn(common.strToTitleCase("Empty RecordSet Data"))
      return
    }
    return recordSet
  } catch(err) {
    logger.fmt.error(common.strToTitleCase("Cannot Get RecordSet Data"))
    return
  }
}


// -------------------------------------------------
// DB FindAll Variable
async function findAll(coll, params) {
  try {
    let recordSet = await database.conn.collection(coll).find(params).toArray()

    if (validate.isEmpty(recordSet)) {
      logger.fmt.warn(common.strToTitleCase("Empty RecordSet Data"))
      return
    }
    return recordSet
  } catch(err) {
    logger.fmt.error(common.strToTitleCase("Cannot Get RecordSet Data"))
    return
  }
}


// -------------------------------------------------
// DB FindCustom Variable
async function findCustom(coll, params, limitRow, totalPage, sortField) {
  try {
    let paramsSort = {}
        paramsSort[sortField] = 1
    let paramsPage = limitRow * (totalPage - 1)

    let recordSet = await database.conn.collection(coll).find(params).sort(paramsSort).limit(limitRow).skip(paramsPage).toArray()

    if (validate.isEmpty(recordSet)) {
      logger.fmt.warn(common.strToTitleCase("Empty RecordSet Data"))
      return
    }
    return recordSet
  } catch(err) {
    logger.fmt.error(common.strToTitleCase("Cannot Get RecordSet Data"))
    return
  }
}


// -------------------------------------------------
// DB CountData Variable
async function countData(coll, params) {
  try {
    let recordSet = await database.conn.collection(coll).count(params)

    if (validate.isEmpty(recordSet)) {
      logger.fmt.warn(common.strToTitleCase("Empty RecordSet Data"))
      return
    }
    return recordSet
  } catch(err) {
    logger.fmt.error(common.strToTitleCase("Cannot Get RecordSet Data"))
    return
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  findOne,
  findAll,
  findCustom,
  countData
}
