// -------------------------------------------------
// String to Title Case Function
function strToTitleCase(str) {
  return str.replace (/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}


// -------------------------------------------------
// Export Module
module.exports = {
  strToTitleCase
}
