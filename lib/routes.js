'use strict';
var async = require('async'),
    _ = require('lodash'),
    logger = require('./logger');

/**
 * Sets up the standard routes for the application. Check the express documentation on routers.
 * @param  {Function} next The async callback. Signature (error, result)
 * @param  {Object}   data Contains results of the `models` and `httpd` task.
 */
function routes(next, data) {
    var router = new require('express').Router();
    // Create a User.
    router.route('/user')
        .get(
            function (req, res, next) { logger.error("Auth not implemented yet"); },
            function (req, res) {
                return res.render('create', req.user);
            }
        )
        .post(
            function(req, res, next) { logger.error("Auth Not implemented yet"); },
            function create(req, res) {
                if (req.body.username && req.body.password) {
                    var user = new data.models.user({
                        username: req.body.username,
                        password: req.body.password
                    }).save(function (error) {
                        if (error) { return res.status(401).send('You didn\'t do it!'); }
                        return res.redirect('/auth?good');
                    });
                } else {
                    return res.status(401).send('More info needed');
                }
            }
        );


    // Login a User.
    router.route('/auth')
        .get(function (req, res) {
            res.render('login', req.user);
        })
        .post(function (req, res) {
            logger.error("Auth not implemented yet.");
        });
    // Log out.
    router.get('/auth/logout', function (req, res) {
        logger.error("Auth Not implemented yet.");
        res.redirect('/auto');

    });

    // A list of valid items to visualize.
    router.get('/api',
        //function (req, res, next) { logger.error("Auth not implemented yet"); next(); },
        function (req, res) {
            data.models.query.find({}, "-_id title description").exec(function (err, data) {
                if (err) { return res.send(err); }
                res.json({ visualizations: data });
            });
        }
    );

    // The information, data, and meta-information for the specified item.
    router.get('/api/:title',
        function (req, res, next) { logger.error("Auth Not implemented yet."); next(); },
        function (req, res) {
            data.models.query.findOne({ title: req.params.title }).populate('executions').exec(function (err, data) {
                if (err) { return res.send(err); }
                // Prepare a response in the given format.
                var item = {
                    //_id: data._id,
                    title: data.title,
                    description: data.description,
                    data: {},
                    meta: {
                        user_id: data.user_id || null,
                        map: data.map || null,
                        filter: data.filter || null,
                        reduce: data.reduce || null
                    }
                };
                // Populate the data section. Pluck only the values.
                item.data.json = _.chain(data.executions)
                    .where({ status: 'complete' }) // Make sure it's complete.
                    .pluck('value')
                    .reduce(function reduce(result, item) {
                        // Get the keys, map over them.
                        _.keys(item).map(function map(key) {
                            // Make sure the key exists in the results otherwise we get an error.
                            if (!result[key]) {
                                result[key] = [];
                            }
                            // Push the result. Returning is not necessary.
                            result[key].push(item[key]);
                        });
                        return result; // Return the result into the reduce.
                    }, {})
                    .value(); // Pull the value out of the chain.
                res.json(item);
            });
        }
    );

    // Attach the router.
    data.httpd.use(router);
    next(null, router);
}

// This task depends on `models` and `httpd` tasks.
module.exports = [ 'models', 'httpd', routes ];