const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const selectKeyObj = require('../../../src/parser/selectKey');

describe('UNIT:selectKey.js -- Test selectKey', () => {

  it('Test select key and should return field a is key ', () => {
    const datas = [{
      a: 1
    }, {
      a: 2
    }];
    const result = selectKeyObj.selectKey(datas);
    expect(result).to.equal('a');
  });

  it('Test select key and should return field b is key', () => {
    const datas = [{
      a: 1,
      b:1
    }, {
      a: 1,
      b:2
    }];
    const result = selectKeyObj.selectKey(datas);
    expect(result).to.equal('b');
  });

  it('Test select key and should return field b is key', () => {
    const datas = [{
      a: '1',
      b:1
    }, {
      a: '2',
      b:2
    }];
    const result = selectKeyObj.selectKey(datas);
    expect(result).to.equal('b');
  });

  it('Test select key no unqiue field  and should return default key name and new datas', () => {
    const datas = [{
      a: 1,
      b:1
    }, {
      a: 1,
      b:1
    }];
    const result = selectKeyObj.selectKey(datas);
    expect(result).to.equal('_id_');
  });
});
