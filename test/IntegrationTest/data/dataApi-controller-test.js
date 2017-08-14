const config = require('../test-config');
const chai = require('chai');
const assert = chai.assert;

const app = require('../../../index');
const request = require('supertest')(app);

describe('Integration: dataApi-controller.js -- Get Data use restful api ', () => {
  before(() => {
    config.connect();
  });

  after(() => {
    config.close();
  });


  it('should get data and return status 200', () => {
    const input = {
      data: [{
        id: '1',
        author: 'mark'
      }],
      author: 'Mark',
      describe: 'Test'
    };


    let keyId = '';
    return request.post('/datas').send(input).expect(200)
            .then((res) => {
              assert.equal(res.body.author, 'Mark');
              keyId = res.body._id;
              const author = 'mark';
              const url = `/api/${author}/${keyId}-datas`;
              return request.get(url).expect(200);
            }).then(() => request
                    .del(`/datas/${keyId}`)
                    .expect(200));
  });
});

describe('Integration: dataApi-controller.js -- Getting Data from graphQL api ', () => {
  let keyId;

  before(() => {
    config.connect();
  });

  before('Creating test data', () => {
    const input = {
      data: [{
        id: '1',
        company: '001',
        author: 'mark',
        age: 20
      }],
      author: 'Mark',
      describe: 'Test'
    };
    return request.post('/datas')
            .send(input)
            .then((res) => {
              keyId = res.body._id;
            });
  });


  it('should get data and return status 200', () => {
    const author = 'mark';
    return request.post(`/api/${author}/${keyId}-datas/graphql`)
            .send({
              query: '{ datas { author } }'
            }).then((res) => {
              const result = res.body.data.datas;
              assert.isArray(result);
              assert.lengthOf(result, 1);
              assert.property(result[0], 'author');
              assert.notProperty(result[0], 'id');
            });
  });

  it('should get datas while I will take the author and age of filed', () => {
    const author = 'mark';
    return request.post(`/api/${author}/${keyId}-datas/graphql`)
            .send({
              query: '{ datas { author,age }}'
            }).then((res) => {
              const result = res.body.data.datas;
              assert.isArray(result);
              assert.lengthOf(result, 1);
              assert.property(result[0], 'author');
              assert.property(result[0], 'age');
              assert.notProperty(result[0], 'id');
            });
  });

  after(() => request.del(`/datas/${keyId}`).expect(200));

  after(() => {
    config.close();
  });

});

describe('Integration: dataApi-controller.js -- Getting Data from graphQL api (array data)', () => {
  let keyId;

  before(() => config.connect());

  before('Creating test data', () => {
    const input = {
      data: [{
        id: '1',
        company: '001',
        author: 'mark',
        age: 20
      }, {
        id: '2',
        company: '002',
        author: 'lin',
        age: 20
      }],
      author: 'Mark',
      describe: 'Test'
    };
    return request.post('/datas')
            .send(input)
            .then((res) => {
              keyId = res.body._id;
            });
  });


  it('should get data and return status 200', () => {
    const author = 'mark';
    return request.post(`/api/${author}/${keyId}-datas/graphql`)
            .send({
              query: '{ datas { author,age } }'
            }).then((res) => {
              const result = res.body.data.datas;
              assert.isArray(result);
              assert.lengthOf(result, 2);
              assert.property(result[0], 'author');
              assert.property(result[0], 'age');
              assert.notProperty(result[0], 'id');
            });
  });


  after(() => request.del(`/datas/${keyId}`).expect(200));

  after(() => {
    config.close();
  });

});

describe('Integration: dataApi-controller.js -- Getting Data from graphQL api (nest data)', () => {
  let keyId;

  before(() => config.connect());

  before('Creating test data', () => {
    const input = {
      data: [{
        id: '1',
        company: {
          name: 'goodjob',
          phone: '12345'
        },
        author: 'mark',
        age: 20
      }, {
        id: '2',
        company: {
          name: 'job',
          phone: '12345'
        },
        author: 'lin',
        age: 20
      }],
      author: 'Mark',
      describe: 'Test'
    };
    return request.post('/datas')
            .send(input)
            .then((res) => {
              keyId = res.body._id;
            });
  });


  it('should get data when getting the nest data', () => {
    const author = 'mark';
    return request.post(`/api/${author}/${keyId}-datas/graphql`)
            .send({
              query: '{ datas { author,age } }'
            }).then((res) => {
              console.log(res.body);
              const result = res.body.data.datas;
              assert.isArray(result);
              assert.lengthOf(result, 2);
              assert.property(result[0], 'author');
              assert.property(result[0], 'age');
            });
  });


  after(() => request.del(`/datas/${keyId}`).expect(200));

  after(() => {
    config.close();
  });

});
