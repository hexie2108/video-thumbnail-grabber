const express = require('express');
const router = express.Router();
const thumbnailGrabberLogic = require('../logic/thumbnail_grabber');


router.get('/thumbnail-grabber', async function (req, res) {

    let videoId = req.query.video_id;
    let videoType = req.query.video_type;

    let result = await thumbnailGrabberLogic.getThumbnail(videoId, videoType);
    res.status(result.status);
    res.json(result.body);

});


router.use('/', express.static('public'));


module.exports = router;
