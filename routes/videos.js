var express = require('express');
var router = express.Router();
require('../models/users');

var jwt = require('express-jwt');
var auth = jwt({
 secret: 'secret',
 userProperty: 'payload'
});

var ctrlAuth = require('../controllers/authentication');

var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost:27017/vidzy';
mongoose.connect(dbURI);






var videoSchema = new mongoose.Schema({
    title: String,
    genre: String,
    description: String
});

var VideoModel = mongoose.model('VideoModel', videoSchema, 'videos');

router.get('/', auth, function(req, res) {
//    var collection = db.get('videos');
//    collection.find({}, function(err, videos){
//        if (err) throw err;
//      	res.json(videos);
//    });

VideoModel.find({}, function(err, videos){
        if (err) throw err;
      	res.json(videos);
    });
});

router.post('/', auth, function(req, res){
/*   var collection = db.get('videos');
   collection.insert({
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
    */
    var vid = new VideoModel();
    vid.title = req.body.title;
    vid.description = req.body.description;
    vid.save(function(err, video){
        if (err) throw err;

        res.json(video);
    });


});

router.get('/:id', auth, function(req, res) {
/*    var collection = db.get('videos');
    collection.findOne({ _id: req.params.id }, function(err, video){
        if (err) throw err;

      	res.json(video);
    });
    */
    VideoModel.findOne({ _id: req.params.id }, function(err, video){
        if (err) throw err;

      	res.json(video);
    });
});

router.put('/:id', auth, function(req, res){
/*    var collection = db.get('videos');
    collection.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
    */
    VideoModel.update({
        _id: req.params.id
    },
    {
        title: req.body.title,
        description: req.body.description
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });
});

router.delete('/:id', auth, function(req, res){
/*    var collection = db.get('videos');
    collection.remove({
        _id: req.params.id
    }, function(err, video){
        if (err) throw err;

        res.json(video);
    });*/
    VideoModel.remove({
        _id: req.params.id
}, function(err, video){
    if (err) throw err;

    res.json(video);
})
    });


module.exports = router;
