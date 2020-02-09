const response = require('../../../../pkg/utils/response')
const healthz = require('../../../../pkg/utils/health')


// -------------------------------------------------
// Index Root Function
function index(req, res) {
  response.resSuccess(res, 'Codebase NodeJS REST is running')
}


// -------------------------------------------------
// Index Health Function
function health(req, res) {
  healthz.healthCheck(res)
}


// -------------------------------------------------
// Export Module
module.exports = {
  index,
  health
}
