const DataService = require('./data-service');
const DataSchema = require('../../factories/schema-factory').DataSchema;
const DataDetailSchema = require('../../factories/schema-factory').DataDetailSchema;

const dataService = new DataService(DataSchema, DataDetailSchema);

class DataController {
  constructor(dataService) {
    this.dataService = dataService;
  }

  create(req, res, next) {
    const input = req.body;
    try {
      const result = this.dataService.create(input);
      result.then((data) => {
        if (data) {
          return res.status(200).json(data);
        }
        return res.status(500).end();

      }).catch(err => res.status(400).json(err));
    } catch (e) {
      next(e);
    }

  }

  remove(req, res, next) {
    const removeId = req.params.datasKey;
    try {
      const result = this.dataService.remove(removeId);
      result.then((data) => {
        if (data) {
          return res.status(200).json({
            status: true
          });
        }
        return res.status(500).end();

      }).catch(err => next(err));
    } catch (e) {
      return res.status(500).end();
    }
  }

  getAllDatas(req, res, next) {
    try {
      const result = this.dataService.getAllData(10);
      result.then((datas) => res.status(200).json(datas)).catch(err => next(err));
    } catch (e) {
      return res.status(500).end();
    }
  }

  getDataById(req, res, next) {
    try {
      const id = req.params.datasKey;
      const result = this.dataService.getDataById(id);
      result.then((data) => res.status(200).json(data)).catch(err => next(err));
    } catch (e) {
      return res.status(500).end();
    }
  }
}

module.exports = new DataController(dataService);
