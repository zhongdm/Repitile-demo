var express = require('express')
var router = express.Router()
var db = require('../model/db')
var requestTime = function (req, res, next) {
  req.requestTime = Date.now()
  next()
}

router.use(requestTime)

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  req.time='12time'
  next('')
})
// define the home page route
router.get('/', function (req, res) {
  let project = {project_name: 'test', create_time: '2017-03-28 14:09:29'};
    let sqlString = 'INSERT INTO project SET ?';
    let connection = db.connection();
    db.insert(connection, sqlString, project, function(id){
        console.log('inserted id is:' + id);
    });
    db.close(connection);
    return;
  // var responseText = 'Hello World!<br>'
  // responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  // res.send(responseText)
  // res.send('Birds home page')
})
// define the about route
router.get('/about', function (req, res) {
  console.log(req.hostname)
  res.send('About birds'+[req.toString()]+"   "+req.method + "  "+req.originalUrl+
  "  "+req.app.get('view engine')+" "+req.baseUrl)
})

module.exports = router
