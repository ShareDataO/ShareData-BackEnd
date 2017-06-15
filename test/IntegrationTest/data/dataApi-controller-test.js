debugger;
var mongoose = require('mongoose');
var config = require('../test-config');
var chai = require('chai');
var expect = chai.expect;

var app = require('../../../index');
var request = require('supertest')(app);

describe('Integration: dataApi-controller.js -- Get Data use restful api ', () => {
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


  it('should get data and return status 200', (done) => {
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

    var getPromise = function(url) {
      return new Promise((resolve, reject) => {
        request
          .get(url)
          .expect(200)
          .end((err, res) => {
            var actualDatas = res.body;
            resolve(actualDatas);
            expect(actualDatas.length).to.equal(1);
          })
      });
    };

		var keyId = "";
		createPromise.then((createRes) => {
			keyId = createRes.body._id;
			var author = "mark";
			var url = '/api/' + author + '/' + keyId + '-datas';
			return getPromise(url);
		}).then((resolve, reject) => {
			request
				.del("/datas/" + keyId)
				.expect(200)
				.end((err, res) => {
					done();
				})
		}).catch((err) => {
			console.log(err);
		});

  });

});
