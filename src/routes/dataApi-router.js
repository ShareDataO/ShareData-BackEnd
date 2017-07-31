const controller = require('../controllers/dataApi-controller');
const Router = require('express').Router;
const router = new Router();

router.route('/:author/:dataId')
  .get((...args) => controller.apiGetDatas(...args));

router.route('/:author/:dataId/:selectId')
  .get((...args) => controller.apiGetDataById(...args));

router.route('/:author/:dataId/graphql')
  .post((...args) => controller.graphQl(...args));

module.exports = router;
