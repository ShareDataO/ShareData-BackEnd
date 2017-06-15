debugger;
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var selectKeyObj = require('../../../src/parser/selectKey');

describe('UNIT:selectKey.js -- Test selectKey', () => {

  it('Test select key and should return field a is key ', () => {
    var datas = [{
      "a": 1
    }, {
      "a": 2
    }];
    var result = selectKeyObj.selectKey(datas);
    expect(result).to.equal("a");
  });

  it('Test select key and should return field b is key', () => {
    var datas = [{
      "a": 1,
			"b":1
    }, {
      "a": 1,
			"b":2
    }];
    var result = selectKeyObj.selectKey(datas);
    expect(result).to.equal("b");
  });

  it('Test select key and should return field b is key', () => {
    var datas = [{
      "a": "1",
			"b":1
    }, {
      "a": "2",
			"b":2
    }];
    var result = selectKeyObj.selectKey(datas);
    expect(result).to.equal("b");
  });

  it('Test select key no unqiue field  and should return default key name and new datas', () => {
    var datas = [{
      "a": 1,
			"b":1
    }, {
      "a": 1,
			"b":1
    }];
    var result = selectKeyObj.selectKey(datas);
    expect(result).to.equal("_id_");
  });
});
