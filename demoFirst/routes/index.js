var express = require('express');
var router = express.Router();
var path = require('path')
var birds = require('./birds')
var mw = require('./middleware.js')

router.use(mw({ option1: '1', option2: '2' }))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express1123qwe' });
});
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'lllayout' });
});

router.use('/static', express.static(path.join(__dirname, 'public')));
router.get('/example/b', function (req, res, next) {
  console.log('the response will be sent by the next function ...')
  next()
}, function (req, res) {
  res.send('Hello from B!')
})

router.route('/book')
  .get(function (req, res) {
    console.log(req)
    res.send('Get a random book'+req.option)
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })

  router.use('/birds', birds)

  
module.exports = router;
