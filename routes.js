const Router = require('express').Router;
const router = new Router();

const data = require('./src/model/data/data-router');
const apiData = require('./src/model/data/dataApi-router');


router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to server API!' });
});


router.use('/datas',data);
router.use('/api',apiData);

module.exports = router;
