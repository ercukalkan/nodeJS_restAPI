const expect = require('chai').expect;

const authMW = require('../middleware/isAuth');

it('should check authorization', function () {
    const req = {
        get: function () {
            return null;
        }
    };

    expect(authMW.bind(this, req, {}, () => { })).to.throw('not authenticated 123');
});