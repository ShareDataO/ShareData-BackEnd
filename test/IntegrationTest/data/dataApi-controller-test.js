const mongoose = require('mongoose');
const config = require('../test-config');
const chai = require('chai');
const expect = chai.expect;

const app = require('../../../index');
const request = require('supertest')(app);

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
            author: "Mark",
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
