debugger;
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var selectKey = require('../../../src/parser/selectKey');
var parserObj = require('../../../src/parser/jsonParser');

describe('UNIT:.jsonParserjs -- Test jsonParser', () => {
var stub ;
  before(() => {
    stub = sinon.stub(selectKey,"selectKey", function customSelctKey() {
      return "test"
    });
  });

  after(() => {
		stub.restore();
  });

  it('Test input numer and should return status false', () => {
    var result = parserObj.jsonParser(1);
    expect(result.status).to.equal(false);
  });

  it('Test obj and should return status true , and result should array ob', () => {
    var result = parserObj.jsonParser({
      "a": 1
    });
    expect(result.status).to.equal(true);
    expect(result.datas.hasOwnProperty("length")).to.equal(true)
  });

  it('Test array and should returns status true , and result should array', () => {
    var result = parserObj.jsonParser([{
      "a": 1
    }]);
    expect(result.status).to.equal(true);
    expect(result.datas.hasOwnProperty("length")).to.equal(true)
  });

});
