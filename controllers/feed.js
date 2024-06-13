const { validationResult } = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

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

    if (!req.file) {
        const error = new Error('no image provided');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path.replace("\\", "/");
    const title = req.body.title;
    const content = req.body.content;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
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

        if (!post) {
            const error = new Error('could not find post');
            error.statusCode = 404;
            throw error;
        }

        res
            .status(200)
            .json({
                message: 'post has been retrieved successfully',
                post: post
            });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            const error = new Error('validation failed, the data you entered is incorrect');
            error.statusCode = 422;
            throw error;
        }

        const title = req.body.title;
        const content = req.body.content;
        let imageUrl = req.body.image;

        if (req.file) {
            imageUrl = req.file.path;
        }
        if (!imageUrl) {
            const error = new Error('no file was picked');
            error.statusCode = 422;
            throw error;
        }

        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('could not find post');
            error.statusCode = 404;
            throw error;
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }

        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;

        const savedPost = await post.save();

        res
            .status(200)
            .json({
                message: 'post has been updated successfully',
                post: savedPost
            })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
}