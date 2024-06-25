const { validationResult } = require('express-validator');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const customIO = require('../socket');

exports.getPosts = async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 2;

        let totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .populate('creator')
            .sort({
                createdAt: -1
            })
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        if (posts) {
            res
                .status(200)
                .json({
                    message: 'posts have been retrieved successfully',
                    posts: posts,
                    totalItems: totalItems
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
    let creator;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });

    try {
        const savedPost = await post.save();
        console.log(savedPost);

        const addedUser = await User.findById(req.userId);
        addedUser.posts.push(post);

        creator = addedUser;

        const savedUser = await addedUser.save();

        customIO.getIO().emit('posts456', {
            action789: 'create',
            post123: post
        });

        res.status(201).json({
            message: 'Post created successfully',
            post: post,
            creator: {
                _id: creator._id,
                name: creator.name
            }
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

        const post = await Post.findById(postId).populate('creator');

        if (!post) {
            const error = new Error('could not find post');
            error.statusCode = 404;
            throw error;
        }

        if (post.creator._id.toString() !== req.userId) {
            const error = new Error('not authorized');
            error.statusCode = 403;
            throw error;
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }

        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;

        const savedPost = await post.save();

        customIO.getIO().emit('posts456', {
            action789: 'update',
            post123: savedPost
        });

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

exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error('could not find the post');
            error.statusCode = 404;
            throw error;
        }

        if (post.creator.toString() !== req.userId) {
            const error = new Error('not authorized');
            error.statusCode = 403;
            throw error;
        }

        clearImage(post.imageUrl);

        const removedPost = await Post.findByIdAndDelete(postId);

        const user = await User.findById(req.userId);

        await user.posts.pull(postId);

        const savedUser = await user.save();

        customIO.getIO().emit('posts456', {
            action789: 'delete',
            post123: postId
        });

        res.status(200).json({
            message: 'deleted post successfully'
        });
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