const controller = require('./data-controller');
const Router = require('express').Router;
const router = new Router();

router.route('/')
  .get((...args) => controller.getAllDatas(...args))
  .post((...args) => controller.create(...args));

router.route('/:datasKey')
	.delete((...args) => controller.remove(...args))
	.get((...args) => controller.getDataById(...args));

module.exports = router;
