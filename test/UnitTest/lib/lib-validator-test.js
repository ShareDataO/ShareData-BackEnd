const chai = require('chai');
const expect = chai.expect;

const validator = require('../../../src/lib/lib-validator');

describe('UNIT:validator.js -- Test validator', () => {


  it('Test simple object and one field value is empty', () => {

    const testObj = {
      aaa: 'aaa',
      bbb: ' '
    };

    validator.config = {
      aaa : 'isNonEmpty',
      bbb :'isNonEmpty'
    };

    const result = validator.validate(testObj);
    expect(result).to.equal(false);
  });

  it('Test string varible and is empty', () => {

    const test = ' ';

    validator.config = ['isNonEmpty'];

    const result = validator.validate(test);
    expect(result).to.equal(false);
  });

  it('Test data is [] and should valiate false', () => {

    const test = {
      aaa:'aaa',
      bbb: []
    };

    validator.config = {
      aaa : 'isNonEmpty',
      bbb :'isArrayAndHaveData'
    };

    const result = validator.validate(test);
    expect(result).to.equal(false);
  });
});
