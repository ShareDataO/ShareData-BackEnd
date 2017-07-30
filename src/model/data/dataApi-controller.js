const DataService = require('./data-service');
const DataApiService = require('./dataApi-service');
const DataSchema = require('../../factories/schema-factory').DataDetailSchema;
const DataDetailSchema = require('../../factories/schema-factory').DataDetailSchema;

const dataService = new DataService(DataSchema, DataDetailSchema);
const dataApiService = new DataApiService(DataDetailSchema);

const graphql = require('graphql').graphql;
const graphQlScheam = require('./schemas/graphQl-schema');

class DataApiController {
  constructor(dataService, dataApiService) {
    this.dataService = dataService;
    this.dataApiService = dataApiService;
  }

  apiGetDatas(req, res, next) {
    try {
      const dataIdString = req.params.dataId;
      const dataId = dataIdString.split('-')[0];
      const result = this.dataApiService.get(dataId);
      result.then((datas) => {
        if (datas) {
          return res.status(200).json(datas);
        }
        return res.status(500).end();

      });
    } catch (e) {
      next(e);
    }
  }

  apiGetDataById(req, res, next) {
    try {
      const dataIdString = req.params.dataId;
      const dataId = dataIdString.split('-')[0];
      const selectId = req.params.selectId;

      const result = this.dataApiService.getById(dataId, selectId);
      result.then((datas) => {
        if (datas) {
          return res.status(200).json(datas);
        }
        return res.status(500).end();

      });
    } catch (e) {
      next(e);
    }
  }

  graphQl(req, res, next) {
    const dataIdString = req.params.dataId;
    const dataId = dataIdString.split('-')[0];
    const query = req.body.query;
    this.dataApiService.get(dataId).then((datas) => {
      if (datas) {
        const scheam = graphQlScheam(datas);
        return  graphql(scheam, query);
      }
      return res.status(500).end();

    }).then((datas) => {
      if (datas.errors) {
        next(datas.errors[0].message);
        return;
      }
      return res.status(200).json(datas);
    }).catch((err) => {
      next(err);
    });
  }
}

module.exports = new DataApiController(dataService, dataApiService);
