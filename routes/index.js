var express = require('express');
var router = express.Router();
require('../models/users');
var ctrlAuth = require('../controllers/authentication');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);


module.exports = router;
