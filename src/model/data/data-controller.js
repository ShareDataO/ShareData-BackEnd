const DataService = require('./data-service');
var DataSchema = require('./data-schema');
var DataDetailSchema = require('./dataDetail-schema');

var dataService = new DataService(DataSchema, DataDetailSchema);

class DataController {
  constructor(dataService) {
    this.dataService = dataService;
  }

  create(req, res, next) {
    let input = req.body;
    try {
      var result = this.dataService.create(input);
      result.then((data) => {
        if (data) {
          return res.status(200).json(data);
        } else {
          return res.status(500).end();
        }
      }).catch(err => {
				return res.status(400).json(err);
			});
    } catch (e) {
      next(e);
    };

  }

  remove(req, res, next) {
    let removeId = req.params.datasKey;
    try {
      var result = this.dataService.remove(removeId);
      result.then((data) => {
        if (data) {
          return res.status(200).json({
            "status": true 
          });
        } else {
          return res.status(500).end();
        }
      }).catch(err => next(err));
    } catch (e) {
      return res.status(500).end();
    };
  }

  getAllDatas(req, res, next) {
    try {
      var result = this.dataService.getAllData(10);
      result.then((datas) => {
        return res.status(200).json(datas);
      }).catch(err => next(err));
    } catch (e) {
      return res.status(500).end();
    }
  };

	getDataById(req,res,next) {
		try{
			var id = req.params.datasKey;
			var result = this.dataService.getDataById(id);
			result.then((data) => {
				return res.status(200).json(data);
			}).catch(err => next(err));
		}catch(e){
      return res.status(500).end();
		}
	}
}

module.exports = new DataController(dataService);
