const { validationResult } = require('express-validator');

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

exports.addPost = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
        return res.status(422).json({
            message: 'validation failed, the data you entered is incorrect',
            errors: validationErrors.array()
        })
    }

    const title = req.body.title;
    const content = req.body.content;

    res.status(201).json({
        message: 'Post created successfully',
        post: {
            _id: new Date().toISOString(),
            title: title,
            content: content,
            creator: {
                name: 'ercu'
            },
            createdAt: new Date()
        }
    });
}