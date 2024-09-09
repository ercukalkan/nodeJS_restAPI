const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const authController = require('../controllers/user');

describe('auth controller - login', function () {
    it('should throw an error with code 500 if db access fails', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'ercukalkann@gmail.com',
                password: 'hsxbqr123'
            }
        };

        authController.login(req, {}, () => { })
            .then(res => {
                expect(res).to.be.an('error');
                expect(res).to.have.property('statusCode', 500);
                done();
            });
        User.findOne.restore();
    });
});