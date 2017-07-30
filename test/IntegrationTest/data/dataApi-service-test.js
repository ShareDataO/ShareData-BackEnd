const mongoose = require('mongoose');
const config = require('../test-config');
const chai = require('chai');
const expect = chai.expect;

const DataServiceClass = require('../../../src/model/data/data-service');
const DataApiServiceClass = require('../../../src/model/data/dataApi-service');
const DataSchema = require('../../../src/factories/schema-factory').DataSchema;
const DataDetailSchema = require('../../../src/factories/schema-factory').DataDetailSchema;
const DataApiService = new DataApiServiceClass(DataDetailSchema);
const DataService = new DataServiceClass(DataSchema, DataDetailSchema);

describe('Integration: dataApi-service.js -- Get Data', () => {
  before(() => {
    config.connect((err) => {
      if (err) {
        console.log(err.message);
      }
    });
  });

  after(() => {
    config.close((msg) => {
      console.log(msg);
    });
  });


  it('should return datas and clear datas', (done) => {
    const obj = [{
      id: '1',
      price: '100'
    }, {
      id: '2',
      price: '200'
    }, {
      id: '3',
      price: '200'
    }];
    const datas = {
      data: obj,
      describe: 'test',
      author: 'Mark'
    };
    const createResult = DataService.create(datas);
    let dataId = '';
    createResult.then((data) => DataService.find({
      _id: data._id.toString()
    })).then((datas) => {
      expect(datas.length).to.equal(1);
      dataId = datas[0]._id.toString();
      return DataApiService.get(dataId);
    }).then((datas) => {
      expect(datas.length).to.equal(3);
      return DataService.remove(dataId);
    }).then((err) => {
      done();
    }).catch((err) => {
      console.log(err);
    });
  });
});

