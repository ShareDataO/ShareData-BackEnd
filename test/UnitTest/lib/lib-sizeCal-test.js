const chai = require('chai');
const expect = chai.expect;

const sizeOf = require('../../../src/lib/lib-sizeCal');

describe('UNIT:sizeCal.js -- Test object bytes size', () => {


  it('Test simple object of 3 chars for key and value', () => {

    const testObj = {
      aaa: 'aaa'
    };
    const actualSize = sizeOf(testObj);
    // 每個string是2,共有6個所以為12bytes
    const expectSize = 12;
    expect(actualSize).to.equal(expectSize);
  });

  it('Test null is 0', () => {
    const actualSize = sizeOf(null);
    expect(actualSize).to.equal(0);
  });

  it('Test number size should equal 8', () => {
    const actualSize = sizeOf(88888);
    expect(actualSize).to.equal(8);
  });

  it('Test string 3 char should equal 6', () => {
    const actualSize = sizeOf('abc');
    expect(actualSize).to.equal(6);
  });

});
