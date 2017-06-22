const controller = require('./dataApi-controller');
const Router = require('express').Router;
const router = new Router();

router.route('/:author/:dataId')
  .get((...args) => controller.apiGetDatas(...args));
  //.post((...args) => controller.create(...args));

router.route('/:author/:dataId/:selectId')
  .get((...args) => controller.apiGetDataById(...args));

router.route('/graphql')
  .post((...args) => controller.graphQl(...args));

module.exports = router;
