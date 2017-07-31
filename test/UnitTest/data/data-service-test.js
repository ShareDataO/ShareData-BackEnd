const chai = require('chai');
const dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
const sinon = require('sinon');
const expect = chai.expect;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DataService = require('../../../src/services/data-service');
const Schema = require('../../../src/factories/schema-factory').DataSchema;
const DataDetailSchema = require('../../../src/factories/schema-factory').DataDetailSchema;
const Service = new DataService(Schema, DataDetailSchema);
const parserObj = require('../../../src/parser/jsonParser');

describe('UNIT:data-service.js -- Get All Data', () => {
  let find;
  beforeEach(() => {
    find = sinon.stub(Schema, 'find');
  });

  afterEach(() => {
    Schema.find.restore();
  });

  it('should return all datas', (done) => {
    const expectResult = {
      test: 'mark'
    };
    const query = '';
    Schema.find.yields(null, expectResult);
    const result = Service.find(query);
    result.then((datas) => {
      sinon.assert.calledOnce(find);
      expect(datas).to.equal(expectResult);
      done();
    });
  });
});

describe('UNIT:data-service.js -- Get Data by Id', () => {
  let find;
  beforeEach(() => {
    find = sinon.stub(Schema, 'find');
  });

  afterEach(() => {
    Schema.find.restore();
  });

  it('should return data', (done) => {
    const expectResult = {
      author: 'mark',
      date: '20000101',
      count: 2,
      size: 100,
      describe: 'Hello Mark'
    };

    Schema.find.yields(null, expectResult);
    const result = Service.getDataById('123');
    result.then((data) => {
      sinon.assert.calledOnce(find);
      const expect = 'mark';
      const actual = data.author;
      expect(actual).to.equal(expect);
      done();
    }).catch((err) => {
      done();
    });
  });
});
describe('UNIT:data-service.js -- Save Data', () => {

  beforeEach(() => {});

  before(() => {
    sinon.stub(Schema.prototype, 'save');
  });

  afterEach(() => {
    Schema.prototype.save.reset();
  });

  after(() => {
    Schema.prototype.save.restore();
  });

  it('should save success', (done) => {

    const testDatas = {
      describe: 'test',
      author: 'Mark',
      data: [{
        id: '1'
      }]
    };

    Schema.prototype.save.yields(null, {
      status: 'success'
    });
    const result = Service.saveData(testDatas);

    result.then((msg) => {
      expect(msg).to.exist;
      expect(Schema.prototype.save.callCount).to.equal(1);
      done();
    }).catch((err) => {
      done();
    });
  });

  it('should save error due to vaild error', (done) => {
    const testDatas = {
      describe: 'test',
      author: 'Mark',
      data: {
        id: '1'
      }
    };

    Schema.prototype.save.yields({
      status: false
    }, null);
    const result = Service.saveData(testDatas);

    result.then((msg) => {}).catch((err) => {
      const status = err.status;
      expect(status).to.equal(false);
      expect(err).to.exist;
      done();
    });
  });

});

describe('UNIT:data-service.js -- test delete data by Id', () => {

  let sinonObj;
  before(() => {
    sinonObj = sinon.stub(Schema, 'findByIdAndRemove');
  });

  after(() => {
    sinonObj.restore();
  });

  it('should delete success', (done) => {
    const expectedResult = {
      status: true
    };
    Schema.findByIdAndRemove.yields(null, expectedResult);
    const result = Service.removeDataByDataId('1');
    result.then((msg) => {
      expect(msg).to.exist;
      done();
    }).catch((err) => {
      console.log(err);
      done();
    });
  });

  it('should delete fail due to no find id', (done) => {
    const expectedResult = {
      status: false
    };
    Schema.findByIdAndRemove.yields(expectedResult, null);
    const result = Service.removeDataByDataId('1');
    result.then((msg) => {

    }).catch((err) => {
      expect(err).to.exist;
      done();
    });

  });
});

describe('UNIT : data-service.js -- test splitData ', () => {
  it('should split 10 element in array', () => {
    const dataId = '1';
    const size = 10000;
    const testObj = {
      id: '1',
      price: '1000'
    };
    const dataArr = [];

    for (let i = 0; i < size; i++) {
      dataArr.push(testObj);
    }

    const input = {
      data: dataArr
    };

    const result = Service.splitData(dataId, input.data);
    expect(result.length).to.equal(10000);
  });
});

describe('UNIT : data-service.js -- test bulk data to DataDetal', () => {

  before(() => {
    sinon.stub(DataDetailSchema.collection, 'insert');
  });

  it('should bulk save success', (done) => {
    const datas = [{
      dataId: '1',
      data: [1, 2, 3],
      isFinal: false
    }, {
      dataId: '2',
      data: [1, 2, 3],
      isFinal: true
    }];

    DataDetailSchema.collection.insert.yields(null, datas);
    const result = Service.bulkSaveDataDetail(datas, (msg) => {
      console.log(msg);
    });

    result.then((datas) => {
      expect(datas).to.exist;
      done();
    }).catch((err) => {
      console.log(err);
      done();
    });
  });
});

describe('UNIT : data-service.js -- test create ', () => {
  let stub;
  after(() => {
    stub.restore();
  });

  it('should create success', (done) => {
    const size = 10000;
    const dataArr = [];
    const testObj = {
      id: '1',
      price: '1000'
    };

    let data = {};

    for (let i = 0; i < size; i++) {
      dataArr.push(testObj);
    }

    stub = sinon.stub(parserObj, 'jsonParser', () => ({
      status: true,
      datas: dataArr
    }));

    data = {
      author: 'mark',
      data: dataArr,
      descript: 'test'
    };

    const stubSaveData = sinon.stub(Service, 'saveData');
    stubSaveData.returns(Promise.resolve({
      _id: '1001'
    }));

    const stubBulkSaveDetail = sinon.stub(Service, 'bulkSaveDataDetail');
    stubBulkSaveDetail.returns(Promise.resolve({
      status: 'success'
    }));

    const result = Service.create(data);
    result.then((datas) => {
      expect(datas.length).to.equal(10000);
      done();
    }).catch((err) => {
      done();
    });
  });

});
describe('UNIT : data-service.js -- test delete datadetail ', () => {
  let sinonObj;
  before(() => {
    sinonObj = sinon.stub(DataDetailSchema.collection, 'remove');
  });

  after(() => {
    sinonObj.restore();
  });

  it('should delete success', (done) => {
    const expectedResult = {
      status: true
    };
    DataDetailSchema.collection.remove.yields(null, expectedResult);
    const result = Service.removeDataDetailsByDataId('1');
    result.then((msg) => {
      expect(msg).to.exist;
      done();
    }).catch((err) => {
      console.log(err);
      done();
    });
  });
});

describe('UNIT : data-service.js -- test remove data method  ', () => {
  let sinonRemoveData;
  let sinonRemoveDetails;

  after(() => {
    sinonRemoveData.restore();
    sinonRemoveDetails.restore();
  });

  it('should delete success', (done) => {
    const expectedResult = {
      status: true
    };

    sinonRemoveData = sinon.stub(Service, 'removeDataByDataId');
    sinonRemoveDetails = sinon.stub(Service, 'removeDataDetailsByDataId');

    sinonRemoveData.returns(Promise.resolve(expectedResult));
    sinonRemoveDetails.returns(Promise.resolve(expectedResult));
    const result = Service.remove('1');
    result.then((msg) => {
      expect(msg).to.exist;
      done();
    }).catch((err) => {
      console.log(err);
      done();
    });
  });
});

describe('UNIT : data-service.js -- test update datadetail method  ', () => {
  let sinonUpdateDataDetail;
  before(() => {
    sinonUpdateDataDetail = sinon.stub(DataDetailSchema, 'findOneAndUpdate');
  });

  after(() => {
    sinonUpdateDataDetail.restore();
  });

  it('should update success', (done) => {
    const expectedResult = {
      status: true
    };

    DataDetailSchema.findOneAndUpdate.yields(null, expectedResult);

    const result = Service.updateDataDetail({
      'data.id': 1
    }, {
      id: 1,
      author: 'Lin'
    });
    result.then((msg) => {
      expect(msg).to.exist;
      done();
    }).catch((err) => {
      console.log(err);
      done();
    });
  });
  it('should update fail', (done) => {
    const expectedResult = {
      status: false
    };

    DataDetailSchema.findOneAndUpdate.yields(expectedResult, null);

    const result = Service.updateDataDetail({
      'data.id': 1
    }, {
      id: 1,
      author: 'Lin'
    });
    result.then((msg) => {
      expect(msg).to.exist;
      done();
    }).catch((err) => {
      done();
    });
  });
});
