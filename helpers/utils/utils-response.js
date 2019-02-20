// -------------------------------------------------
// Write Response Function
function writeResponse(res, statusCode, msg) {
  res.status(statusCode).json({
    status: true,
    code: statusCode,
    message: msg
  })
}


// -------------------------------------------------
// Write Data Response Function
function writeResponseData(res, statusCode, msg, data) {
  res.status(statusCode).json({
    status: true,
    code: statusCode,
    message: msg,
    data: data
  })
}


// -------------------------------------------------
// Write Error Response Function
function writeResponseError(res, statusCode, msg, err) {
  res.status(statusCode).json({
    status: true,
    code: statusCode,
    message: msg,
    error: err
  })
}


// -------------------------------------------------
// Success Response Function
function resSuccess(res, msg) {
  // Set Default Message
  msg = msg !== undefined ? msg : 'Success'

  // Write Response
  writeResponse(res, 200, msg)
}


// -------------------------------------------------
// Success Data Response Function
function resSuccessData(res, data) {
  // Write Response
  writeResponseData(res, 200, 'Success', data)
}


// -------------------------------------------------
// Created Response Function
function resCreated(res, data) {
  // Write Response
  writeResponseData(res, 201, 'Created', data)
}


// -------------------------------------------------
// Updated Response Function
function resUpdated(res, data) {
  // Write Response
  writeResponseData(res, 204, 'Updated', data)
}


// -------------------------------------------------
// Bad Request Response Function
function resBadRequest(res, err) {
  // Set Default Message
  err = err !== undefined ? err : 'Bad Request'

  // Write Response
  writeResponseError(res, 400, 'Bad Request', err)
}


// -------------------------------------------------
// Internal Server Error Response Function
function resInternalError(res, err) {
  // Set Default Message
  err = err !== undefined ? err : 'Internal Server Error'

  // Write Response
  writeResponseError(res, 500, 'Internal Server Error', err)
}


// -------------------------------------------------
// Not Found Response Function
function resNotFound(res, err) {
  // Set Default Message
  err = err !== undefined ? err : 'Not Found'

  // Write Response
  writeResponseError(res, 400, 'Not Found', err)
}


// -------------------------------------------------
// Unauthorized Response Function
function resUnauthorized(res) {
  // Write Response
  writeResponseError(res, 401, 'Unauthorized', 'Unauthorized')
}


// -------------------------------------------------
// Authenticate Response Function
function resAuthenticate(res) {
  res.set('WWW-Authenticate', 'Basic realm="Authorization Required"')
  resUnauthorized(res)
}


// -------------------------------------------------
// Export Module
module.exports = {
  resSuccess,
  resSuccessData,
  resCreated,
  resUpdated,
  resBadRequest,
  resInternalError,
  resNotFound,
  resUnauthorized,
  resAuthenticate
}
