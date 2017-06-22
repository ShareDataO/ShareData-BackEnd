const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DataApiService = require('../../../src/model/data/dataApi-service');
const DataDetailSchema = require('../../../src/factories/schema-factory').DataDetailSchema;
const Service = new DataApiService(DataDetailSchema);

describe('UNIT:dataApi-service.js -- Get Data', () => {

	var find;
  beforeEach(() => {});

  before(() => {
    find = sinon.stub(DataDetailSchema, 'find');
  });

  after(() => {
    DataDetailSchema.find.restore();
  });

  it('should get success', (done) => {

		var expectResult = [{"id":"1"},{"id":"2"}];
		var dataKey = "XXXXXXAAAABBBB";		
		DataDetailSchema.find.yields(null,expectResult);

		var result = Service.get(dataKey);
		result.then((datas) => {
			sinon.assert.calledOnce(find);		
			expect(datas.length).to.equal(2);
			done();
		});

  });


});
