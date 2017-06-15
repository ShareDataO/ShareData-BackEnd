debugger;
var chai = require('chai');
var expect = chai.expect;

var sizeOf = require('../../../src/lib/lib-sizeCal');

describe('UNIT:sizeCal.js -- Test object bytes size', () => {


  it('Test simple object of 3 chars for key and value', () => {

    var testObj = {
      aaa: 'aaa'
    };
    var actualSize = sizeOf(testObj);
    //每個string是2,共有6個所以為12bytes
    var expectSize = 12;
    expect(actualSize).to.equal(expectSize);
  });

  it('Test null is 0', () => {
		var actualSize = sizeOf(null);
    expect(actualSize).to.equal(0);
  });
	
  it('Test number size should equal 8', () => {
		var actualSize = sizeOf(88888);
    expect(actualSize).to.equal(8);
  });

	it('Test string 3 char should equal 6',() => {
		var actualSize = sizeOf('abc');	
		expect(actualSize).to.equal(6);
	});
	
});
