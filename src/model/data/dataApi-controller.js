const DataService = require('./data-service');
const DataApiService = require('./dataApi-service');
var DataSchema = require('./data-schema');
var DataDetailSchema = require('./dataDetail-schema');

var dataService = new DataService(DataSchema, DataDetailSchema);
var dataApiService = new DataApiService(DataDetailSchema);

class DataApiController {
  constructor(dataService, dataApiService) {
    this.dataService = dataService;
    this.dataApiService = dataApiService;
  }

  apiGetDatas(req, res, next) {
    try {
			var dataIdString = req.params.dataId; 
			var dataId = dataIdString.split('-')[0];
			var author = req.params.author;
      var result = this.dataApiService.get(dataId);
      result.then((datas) => {
        if (datas) {
          return res.status(200).json(datas);
        } else {
          return res.status(500).end();
        }
      })
    } catch (e) {
      next(e);
    }
  };

  apiGetDataById(req, res, next) {
    try {
			var dataIdString = req.params.dataId; 
			var dataId = dataIdString.split('-')[0];
			var author = req.params.author;
			var selectId = req.params.selectId;

      var result = this.dataApiService.getById(dataId,selectId);
      result.then((datas) => {
        if (datas) {
          return res.status(200).json(datas);
        } else {
          return res.status(500).end();
        }
      })
    } catch (e) {
      next(e);
    }
  };
}

module.exports = new DataApiController(dataService, dataApiService);
