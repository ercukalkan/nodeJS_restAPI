const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'first post',
                content: 'this is the first post!',
                imageUrl: 'images/item.jpeg',
                creator: {
                    name: 'ercu'
                },
                createdAt: new Date()
            }
        ]
    });
}

exports.addPost = async (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const error = new Error('validation failed, the data you entered is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: 'images/item.jpeg',
        creator: {
            name: 'ercu'
        }
    });

    try {
        const saveResult = await post.save();
        console.log(saveResult);

        res.status(201).json({
            message: 'Post created successfully',
            post: saveResult
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}