//get environmental variables from env file
require('dotenv').config();

const http = require('./conn.util');
const crypto = require('crypto');
const md5 = require('md5');
const querystring = require('querystring');


const SUPPORT_VIDEO_TYPE = {
    bilibili: 'bilibili',
    youtube: 'youtube',
}

const API = {

    bilibili: "https://api.bilibili.com/x/web-interface/view",
    youtube: "https://i.ytimg.com/vi/"
}

//difference size of thumbnail youtube
const YOUTUBE_SIZE ={
    max: "maxresdefault.jpg",
    sd: "sddefault.jpg",
    hq: "hqdefault.jpg",
    mq: "mqdefault.jpg",
    default : 'default.jpg',
}

/**
 * get video thumbnail
 * @param {int} videoId
 * @param {string} videoType
 * @return
 */
async function getThumbnail(videoId, videoType) {


    if (!videoId) {
        return createError("video_id is empty", 400);
    }

    if (!videoType) {
        return createError("video_type is empty", 400);
    }


    let response;

    switch (videoType) {

        case SUPPORT_VIDEO_TYPE.bilibili:
            response = await getBilibiliVideoThumbnail(videoId);
            break;
        case SUPPORT_VIDEO_TYPE.youtube:
            response = await getYoutubeVideoThumbnail(videoId);
            break;
        default:
            response = createError("video_type is not support", 400);
    }

    //if isn't a error response
    if(!response.hasOwnProperty('status')){
        response = {
            body: response,
            status: 200
        }
    }

    return response;

}

/**
 * get bilibili video thumbnail
 * @param {int}videoId
 * @return {Promise<{}>}
 */
async function getBilibiliVideoThumbnail(videoId) {


    let data = {};
    if (!isNaN(videoId)) {
        data.aid = videoId;
    }
    else {
        data.bvid = videoId;
    }

    let response = await http.get(API.bilibili, data);

    return parseBilibiliResponse(response);

}

/**
 * get youtube video thumbnail
 * @param {int}videoId
 * @return {Promise<{}>}
 */
async function getYoutubeVideoThumbnail(videoId) {

    let result = {};

    result.images = [
        API.youtube+videoId+"/"+YOUTUBE_SIZE.max,
        API.youtube+videoId+"/"+YOUTUBE_SIZE.sd,
        API.youtube+videoId+"/"+YOUTUBE_SIZE.hq, 
        API.youtube+videoId+"/"+YOUTUBE_SIZE.mq, 
        API.youtube+videoId+"/"+YOUTUBE_SIZE.default, 
    ]

    return result;

}

/**
 *  parse response from bilibili
 * @param {Object} response
 * @return {Object}
 */
function parseBilibiliResponse(response) {

    let result = {};

    if (response.hasOwnProperty('data') && response.data.hasOwnProperty('pic')) {
        result.images = [response.data.pic];
    } else {
        result = createError(response.message, 500);
    }

    return result;

}




/**
 *create error response
 * @param {string}errorMessage
 * @param {int}errorCode
 * @return {{body: {error : string}, status: int}}
 */
function createError(errorMessage, errorCode) {

    return {
        body: {
            error: errorMessage || 'unknown error'
        },
        status: errorCode || 500,
    }
}


module.exports.getThumbnail = getThumbnail;
