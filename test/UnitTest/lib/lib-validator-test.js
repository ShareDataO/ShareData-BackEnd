debugger;
var chai = require('chai');
var expect = chai.expect;

var validator = require('../../../src/lib/lib-validator');

describe('UNIT:validator.js -- Test validator', () => {


  it('Test simple object and one field value is empty', () => {

    var testObj = {
      aaa: 'aaa',
			bbb: ' '
    };

		validator.config = {
			"aaa" : "isNonEmpty",
			"bbb" :"isNonEmpty"
		}

		var result = validator.validate(testObj);
    expect(result).to.equal(false);
  });

  it('Test string varible and is empty', () => {

		var test = ' '; 

		validator.config = ['isNonEmpty'];

		var result = validator.validate(test);
    expect(result).to.equal(false);
  });

  it('Test data is [] and should valiate false', () => {

		var test = {
			aaa:'aaa',
			bbb: []
		}; 

		validator.config = {
			"aaa" : "isNonEmpty",
			"bbb" :"isArrayAndHaveData"
		}

		var result = validator.validate(test);
    expect(result).to.equal(false);
  });
});
