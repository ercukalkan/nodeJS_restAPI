const expect = require('chai').expect;

const authMW = require('../middleware/isAuth');

describe('auth middleware tests', function () {
    it('should check authorization', function () {
        const req = {
            get: function () {
                return null;
            }
        };

        expect(authMW.bind(this, req, {}, () => { }))
            .to
            .throw('not authenticated 123');
    });

    it('token check 123', function () {
        const req = {
            get: function (headerName) {
                return 'xyz';
            }
        };

        expect(authMW.bind(this, req, {}, () => { }))
            .to
            .not
            .throw('asdasd');
    });

    it('give a user id after decoding the token', function () {
        const req = {
            get: function (headerName) {
                return 'Bearer zsadasdasd';
            }
        };
        authMW(req, {}, () => { });
        expect(req)
            .to
            .have
            .property('userId');
    });
});