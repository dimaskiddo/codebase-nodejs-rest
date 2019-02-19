// -------------------------------------------------
// OK Response Function
function resOK(res, msg) {
  // Set Default Message
  msg = msg !== undefined ? msg : "Success"

  res.status(200).json({
    status: true,
    code: 200,
    message: msg
  })
}


// -------------------------------------------------
// Data Response Function
function resData(res, data) {
  res.status(200).json({
    status: true,
    code: 200,
    data
  })
}


// -------------------------------------------------
// Bad Request Response Function
function resBadRequest(res, msg) {
  // Set Default Message
  msg = msg !== undefined ? msg : "Bad Request"
  
  res.status(400).json({
    status: false,
    code: 400,
    message: 'Bad Request',
    error: msg
  })
}


// -------------------------------------------------
// Internal Server Error Response Function
function resInternalError(res, msg) {
	// Set Default Message
  msg = msg !== undefined ? msg : "Internal Server Error"
  
  res.status(500).json({
    status: false,
    code: 500,
    message: 'Internal Server Error',
    error: msg
  })
}


// -------------------------------------------------
// Not Found Response Function
function resNotFound(res, msg) {
	// Set Default Message
  msg = msg !== undefined ? msg : "Not Found"

  res.status(400).json({
    status: false,
    code: 400,
    message: 'Not Found',
    error: msg
  })
}


// -------------------------------------------------
// Unauthorized Response Function
function resUnauthorized(res) {
  res.status(401).json({
    status: false,
    code: 401,
    message: 'Unauthorized',
    error: 'Unauthorized'
  })
}


// -------------------------------------------------
// Authenticate Response Function
function resAuthenticate(res) {
  res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
  resUnauthorized(res)
}


// -------------------------------------------------
// Export Module
module.exports = {
  resOK,
  resData,
  resBadRequest,
  resInternalError,
  resNotFound,
  resUnauthorized,
  resAuthenticate
}
