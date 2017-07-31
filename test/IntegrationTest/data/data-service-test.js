const config = require('../test-config');
const chai = require('chai');
const expect = chai.expect;

const DataService = require('../../../src/services/data-service');
const Schema = require('../../../src/factories/schema-factory').DataSchema;
const DataDetailSchema = require('../../../src/factories/schema-factory').DataDetailSchema;
const Service = new DataService(Schema, DataDetailSchema);

describe('Integration: data-service.js -- Get Data', () => {
  before(() => {
    config.connect();
  });

  after(() => {
    config.close();
  });


  it('should return datas and clear datas', (done) => {
    const obj = [{
      id: '1'
    }, {
      id: '2'
    }, {
      id: '3'
    }];
    const datas = {
      data: obj,
      describe: 'test',
      author: 'Mark'
    };
    const createResult = Service.create(datas);

    createResult.then((data) => Service.find({
      _id: data._id.toString()
    })).then((datas) => {
      expect(datas.length).to.equal(1);
      const removeId = datas[0]._id.toString();
      return Service.remove(removeId);
    }).then((msg) => {
      done();
    }).catch((err) => {
      console.log(err);
    });
  });
});

describe('Integration: data-service.js -- Get Data (One hundred thousand test)', () => {
  before(() => {
    config.connect();
  });

  after(() => {
    config.close();
  });
  it('should return datas and clear datas', (done) => {
    const size = 10;
    const datas = [];

    for (let i = 0; i < size; i++) {
      datas.push({
        id: i,
        aruthor: 'Mark'
      });
    }

    const input = {
      data: datas,
      describe: 'million test',
      author: 'Mark Big'
    };

    const createResult = Service.create(input);

    createResult.then((data) => Service.find({
      _id: data._id.toString()
    })).then((datas) => {
      expect(datas.length).to.equal(1);
      const removeId = datas[0]._id.toString();
      return Service.remove(removeId);
    }).then((msg) => {
      done();
    }).catch((err) => {
      console.log(err);
    });

  }).timeout(100000);
});

describe('Integration: data-service.js -- Update DataDetail', () => {
  before(() => {
    config.connect();
  });

  after(() => {
    config.close();
  });


  it('should update success and clear data ', (done) => {
    const obj = [{
      id: '1',
      author: 'mark'
    }, {
      id: '2',
      author: 'mark'
    }, {
      id: '3',
      author: 'mark'
    }];
    const datas = {
      data: obj,
      describe: 'test',
      author: 'Mark'
    };
    const createResult = Service.create(datas);
    let dataId;
    createResult.then((data) => {
      dataId = data._id.toString();
      return Service.updateDataDetail({
        dataId,
        'data.id': '1'
      }, {
        id: '1',
        author: 'Lin'
      });
    }).then((result) => {
      expect(result.data.author).to.equal('Lin');
      return Service.remove(dataId);
    }).then((msg) => {
      done();
    }).catch((err) => {
      console.log(err);
    });
  });
});

describe('Integration: data-service.js -- Get All Data', () => {
  let removeId;
  before(() => {
    config.connect();
  });

  before(() => {
    const obj = [{
      id: '1'
    }, {
      id: '2'
    }, {
      id: '3'
    }];
    const datas = {
      data: obj,
      describe: 'test',
      author: 'Mark'
    };
    return Service.create(datas);
  });


  it('should return all datas', () => Service.getAllData()
      .then((datas) => {
        expect(datas.length).to.equal(1);
        removeId = datas[0]._id.toString();
      }));

  after(() => Service.remove(removeId));

  after(() => {
    config.close();
  });
});

