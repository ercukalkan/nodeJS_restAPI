const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');
const userController = require('../controllers/user');

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('email address already exists');
                    }
                });
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .not()
        .isEmpty()
], userController.signup);

router.post('/login', userController.login);

module.exports = router;