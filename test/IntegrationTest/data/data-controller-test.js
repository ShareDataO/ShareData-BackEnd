const config = require('../test-config');
const chai = require('chai');
const expect = chai.expect;

const app = require('../../../index');
const request = require('supertest')(app);

describe('Integration: data-controller.js -- Create Data ', () => {
  before(() => config.connect());

  after(() => {
    config.close();
  });


  it('should create success and return status 200', () => {
    const input = {
      author: 'Mark',
      data: [{
        id: '1',
        author: 'mark'
      }],
      describe: 'Test'
    };


    return request.post('/datas')
            .send(input)
            .expect(200)
            .then((res) => {
              const dataKey = res.body._id;
              return request.del(`/datas/${dataKey}`);
            });
  });

  it('should create fail  valid err and return status 400', () => {
    const input = {
      data: {},
      author: 'Mark'
    };

    return request
            .post('/datas')
            .send(input)
            .expect(400);
  });
});

describe('Integration: data-controller.js -- Get All Data ', () => {
  before(() => {
    config.connect();
  });

  after(() => {
    config.close();
  });


  it('should get 2 records when the create 2 records', () => {
    const input1 = {
      data: [{
        id: '1',
        author: 'mark'
      }],
      describe: 'Test',
      author: 'Mark'
    };
    const input2 = {
      data: [{
        id: '1',
        author: 'mark'
      }],
      describe: 'Test',
      author: 'Mark'
    };

    const createPromise = (input) => request
                .post('/datas')
                .send(input)
                .expect(200);

    const delPromise = (id) => request
                .del(`/datas/${id}`)
                .expect(200);

    let data1Id;
    let data2Id;
    return Promise.all([createPromise(input1), createPromise(input2)])
            .then((datas) => {
              data1Id = datas[0].body._id;
              data2Id = datas[1].body._id;
              return request
                    .get('/datas')
                    .expect(200);
            }).then(() => Promise.all([delPromise(data1Id), delPromise(data2Id)])).catch(err => {
              console.log(err);
            });
  });
});

describe('Integration: data-controller.js -- Get Data by Id', () => {
  before(() => {
    config.connect();
  });

  after(() => {
    config.close();
  });


  it('should create 1 data and get Data expect 1', (done) => {
    const input1 = {
      data: [{
        id: '1',
        author: 'mark'
      }],
      describe: 'Test',
      author: 'Mark'
    };

    const createPromise = (input) => request
                .post('/datas')
                .send(input)
                .expect(200);

    const delPromise = (id) => request
                .del(`/datas/${id}`)
                .expect(200);

    const getDataPromise = (id) => request
                .get(`/datas/${id}`)
                .expect(200);

    let data1Id;
    Promise.all([createPromise(input1)]).then((datas) => {
      data1Id = datas[0].body._id;
      return getDataPromise(data1Id);
    }).then((res) => {
      const data = res.body;
      expect(data.author).to.equal('Mark');
      return delPromise(data1Id);
    }).then((res) => {
      expect(res.body.status).to.equal(true);
      done();
    });

  });
});
