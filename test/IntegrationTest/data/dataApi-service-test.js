debugger;
var mongoose = require('mongoose');
var config = require('../test-config');
var chai = require('chai');
var expect = chai.expect;

var DataServiceClass = require('../../../src/model/data/data-service');
var DataApiServiceClass = require('../../../src/model/data/dataApi-service');
var DataSchema = require('../../../src/model/data/data-schema');
var DataDetailSchema = require('../../../src/model/data/dataDetail-schema');
var DataApiService = new DataApiServiceClass(DataDetailSchema);
var DataService = new DataServiceClass(DataSchema, DataDetailSchema);

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
    let obj = [{
      "id": "1",
      "price": "100"
    }, {
      "id": "2",
      "price": "200"
    }, {
      "id": "3",
      "price": "200"
    }];
    let datas = {
      "data": obj,
      "describe": "test",
      "author": "Mark"
    }
    let createResult = DataService.create(datas);
    var dataId = "";
		createResult.then((data) => {
			return DataService.find({
				_id: data._id.toString()
			});
		}).then((datas) => {
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

