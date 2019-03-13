module.exports = function(options) {
  return function(req, res, next) {
    // Implement the middleware function based on the options object
   
    req.option = options.option1 +  options.option2
    console.log(req.option)
    next()
  }
}