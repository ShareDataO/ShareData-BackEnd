const DataService = require('./data-service');
const DataApiService = require('./dataApi-service');
const DataSchema = require('../../factories/schema-factory').DataDetailSchema;
const DataDetailSchema = require('../../factories/schema-factory').DataDetailSchema;

const dataService = new DataService(DataSchema, DataDetailSchema);
const dataApiService = new DataApiService(DataDetailSchema);

//const graphql = require('graphql');
//const scheam = rquire('./graphQl-schema'); 

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

            var result = this.dataApiService.getById(dataId, selectId);
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
    
    graphQl(req, res, next){
        

    }
}

module.exports = new DataApiController(dataService, dataApiService);
