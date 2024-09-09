const expect = require('chai').expect;

it('add numbers correctly', function () {
    const num1 = 2;
    const num2 = 3;

    expect(num1 + num2).to.equal(5);
});

it('add numbers wrongly', function () {
    const num1 = 2;
    const num2 = 3;

    expect(num1 + num2).to.not.equal(6);
});