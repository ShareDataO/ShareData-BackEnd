const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const selectKey = require('../../../src/parser/selectKey');
const parserObj = require('../../../src/parser/jsonParser');

describe('UNIT:.jsonParserjs -- Test jsonParser', () => {
  let stub;
  before(() => {
    stub = sinon.stub(selectKey, 'selectKey', () => 'test');
  });

  after(() => {
    stub.restore();
  });

  it('Test input numer and should return status false', () => {
    const result = parserObj.jsonParser(1);
    expect(result.status).to.equal(false);
  });

  it('Test obj and should return status true , and result should array ob', () => {
    const result = parserObj.jsonParser({
      a: 1
    });
    expect(result.status).to.equal(true);
    expect(Object.prototype.hasOwnProperty.call(result.datas, 'length')).to.equal(true);
  });

  it('Test array and should returns status true , and result should array', () => {
    const result = parserObj.jsonParser([{
      a: 1
    }]);
    expect(result.status).to.equal(true);
    expect(Object.prototype.hasOwnProperty.call(result.datas, 'length')).to.equal(true);
  });

});
