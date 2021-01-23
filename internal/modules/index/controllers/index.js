const response = require('../../../../pkg/utils/response')
const healthz = require('../../../../pkg/utils/healthz')


// -------------------------------------------------
// Index Root Function
async function index(req, res) {
  response.resSuccess(res, 'Codebase NodeJS REST is running')
}


// -------------------------------------------------
// Index Health Function
async function health(req, res) {
  await healthz.healthCheck(res)
}


// -------------------------------------------------
// Export Module
module.exports = {
  index,
  health
}
