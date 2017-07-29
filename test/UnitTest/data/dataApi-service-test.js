const chai = require('chai');
const sinon = require('sinon');
require('sinon-as-promised');
const expect = chai.expect;

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DataApiService = require('../../../src/model/data/dataApi-service');
const DataDetailSchema = require('../../../src/factories/schema-factory').DataDetailSchema;
const Service = new DataApiService(DataDetailSchema);

describe('UNIT:dataApi-service.js -- Get Data', () => {

	let sandbox;

	before(() => {
		const expectResult = [{ "id": "1" }, { "id": "2" }];
		sandbox = sinon.sandbox.create();
		findStub = sandbox.stub(DataDetailSchema, 'find')
			.resolves(expectResult)
	});

	it('should get success', () => {

		const dataKey = "XXXXXXAAAABBBB";

		return Service.get(dataKey).then((datas) => {
			sinon.assert.calledOnce(findStub);
			expect(datas.length).to.equal(2);
		});

	});

	after(() => {
		 sandbox.restore();
	});
});
