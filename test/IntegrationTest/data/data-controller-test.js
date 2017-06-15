debugger;
var mongoose = require('mongoose');
var config = require('../test-config');
var chai = require('chai');
var expect = chai.expect;

var app = require('../../../index');
var request = require('supertest')(app);

describe('Integration: data-controller.js -- Create Data ', () => {
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


  it('should create success and return status 200', (done) => {
    let input = {
      data: [{
        "id": "1",
        "author": "mark"
      }],
      describe: "Test"
    };

    var createPromise = new Promise((resolve, reject) => {
      request
        .post('/datas')
        .send(input)
        .expect(200)
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        })
    });

    createPromise.then((res) => {
      var dataKey = res.body._id;
      request
        .del('/datas/' + dataKey)
        .expect(200)
        .end((err, res) => {
          done();
        })
    }).catch((err) => {
      next(err);
    });
  });

  it('should create fail becaur valid err and return status 400', (done) => {
    let input = {
      data: {},
      describe: "Test"
    };

    var createPromise = new Promise((resolve, reject) => {
      request
        .post('/datas')
        .send(input)
        .expect(400)
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        })
    });

    createPromise.then((res) => {
			var status = res.body.status;
			expect(status).to.equal(false);
			done();
    }).catch((err) => {
      next(err);
    });
  });
});

describe('Integration: data-controller.js -- Get All Data ', () => {
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


  it('should create 2 data and get allData expect 2', (done) => {
    let input1 = {
      data: [{
        "id": "1",
        "author": "mark"
      }],
      describe: "Test"
    };
    let input2 = {
      data: [{
        "id": "1",
        "author": "mark"
      }],
      describe: "Test"
    };

    var createPromise = (input) => {
      return new Promise((resolve, reject) => {
        request
          .post('/datas')
          .send(input)
          .expect(200)
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
      });
    };

    var delPromise = (id) => {
      return new Promise((resolve, reject) => {
        request
          .del('/datas/' + id)
          .expect(200)
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
      });
    };

    Promise.all([createPromise(input1), createPromise(input2)]).then((datas) => {
			var data1_id = datas[0].body._id;
			var data2_id = datas[1].body._id;
      request
        .get('/datas')
        .expect(200)
        .end((err, res) => {
          Promise.all([delPromise(data1_id), delPromise(data2_id)])
            .then((datas) => {
              done();
            });
        });
    }).catch(err => {
      next(err);
    });
  });
});

describe('Integration: data-controller.js -- Get Data by Id', () => {
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


  it('should create 1 data and get Data expect 1', (done) => {
    let input1 = {
      data: [{
        "id": "1",
        "author": "mark"
      }],
      describe: "Test",
			author:"Mark"
    };

    var createPromise = (input) => {
      return new Promise((resolve, reject) => {
        request
          .post('/datas')
          .send(input)
          .expect(200)
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
      });
    };

    var delPromise = (id) => {
      return new Promise((resolve, reject) => {
        request
          .del('/datas/' + id)
          .expect(200)
          .end((err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          })
      });
    };

		var getDataPromise = (id) => {
			return new Promise((resolve,reject) => {
				request
					.get('/datas/' + id)
					.expect(200)
					.end((err,res) => {
						if(err){
							reject(err);
						}else{
							resolve(res);
						}
					})
			});
		}

		var data1_id;
    Promise.all([createPromise(input1)]).then((datas) => {
			data1_id = datas[0].body._id;
			return getDataPromise(data1_id);
    }).then((res) => {
				var data = res.body;
				expect(data.author).to.equal("Mark");
			return delPromise(data1_id);
		}).then((res) =>{
			expect(res.body.status).to.equal(true);
			done();
		}).catch(err => {
      next(err);
    });
  });
});
