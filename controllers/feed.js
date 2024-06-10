const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();

        if (posts) {
            res
                .status(200)
                .json({
                    message: 'posts have been retrieved successfully',
                    posts: posts
                });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
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

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);

        if (post) {
            res
                .status(200)
                .json({
                    message: 'post has been retrieved successfully',
                    post: post
                });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}