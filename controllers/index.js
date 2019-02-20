const response = require('../helpers/utils/utils-response')
const serviceHealth = require('../helpers/utils/utils-health')


// -------------------------------------------------
// Index Root Function
function index(req, res) {
  response.resSuccess(res, "NodeJS API Framework is running")
}


// -------------------------------------------------
// Index Health Function
function health(req, res) {
  serviceHealth.healthCheck(res)
}


// -------------------------------------------------
// Export Module
module.exports = {
  index,
  health
}
