const mongoose = require('mongoose');
const config = require('../test-config');
const chai = require('chai');
const assert = chai.assert;

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


    it('should get data and return status 200', () => {
        const input = {
            data: [{
                "id": "1",
                "author": "mark"
            }],
            author: "Mark",
            describe: "Test"
        };


        let keyId = "";
        return request.post('/datas').send(input).expect(200)
            .then((res) => {
                assert.equal(res.body.author, "Mark");
                keyId = res.body._id;
                const author = "mark";
                const url = `/api/${author}/${keyId}-datas`;
                return request.get(url).expect(200);
            }).then(() => {
                return request
                    .del("/datas/" + keyId)
                    .expect(200)
            })
    });
});

describe('Integration: dataApi-controller.js -- Getting Data by graphQL api ', () => {
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


    it('should get data and return status 200', () => {
        const input = {
            data: [{
                "id": "1",
                "author": "mark",
                "company": "001",
                "age": 20
            }],
            author: "Mark",
            describe: "Test"
        };

        let keyId = "";
        return request.post('/datas').send(input)
            .then((createRes) => {
                keyId = createRes.body._id;
                const author = "mark";
                return request.post(`/api/${author}/${keyId}-datas/graphql`)
                    .send({
                        query: `{author}`
                    });
            }).then((res) => {
                assert.property(res.body.data, "author");
                assert.notProperty(res.body.data, "id");
                return request.del(`/datas/${keyId}`).expect(200)
            })
    });
});
