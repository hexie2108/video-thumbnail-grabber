//实时物流查询api地址
const API_URL = "/thumbnail-grabber";


//页面切换动画时间 (毫秒)
const ANIMATION_SPEED = 500;

const VIDEO_TYPE = {
    bilibili: 'bilibili',
    youtube: 'youtube',
}

$(function () {




    $("form#grabber").on('submit', function (event) {


        event.preventDefault();

        let $inputElement = $("input#video");
        let videoType = $('input[name="video_type"]:checked').val();

        let videoId = $inputElement.val().trim();

        // case bilibili link
        if (videoType == VIDEO_TYPE.bilibili) {
            videoId = videoId.split("/").pop();
            
        }
        //case youtube
        else{

            if(videoId.includes('watch?v=')){
                videoId = videoId.split('watch?v=').pop();
            }
            else if(videoId.includes('/?v=')){
                videoId = videoId.split('/?v=').pop();
            }
            else{
                videoId = videoId.split("/").pop();
            }
        }

        //remove character after id
        videoId = videoId.split("?")[0];
        videoId = videoId.split("#")[0];
        videoId = videoId.split("&")[0];

        //remove end "/"
        videoId = videoId.replace(/\/$/, '');

        //update value
        $inputElement.val(videoId);

        //remove invalid class
        $inputElement.removeClass('is-invalid');



        if (!videoId) {
            $('form #video').addClass('is-invalid');
            $('form .invalid-feedback').html('错误: video id is null');
            return;
        }


        videoId = videoId.split("/").pop();

        sendRequest(videoId, videoType);

    });

})


function sendRequest(video_id, video_type) {

    //show loading icon
    $('.loading').fadeIn(ANIMATION_SPEED);

    let successCallback = function (response) {

        setElement(response);
    };

    let failCallback = function (jqXHR) {

        let errorResponse = {};
        try {
            errorResponse = JSON.parse(jqXHR.responseText);
        }
        catch (exception) {
            errorResponse.error = 'unknown';
        }

        console.log(errorResponse.error);


        $('form #video').addClass('is-invalid');
        $('form .invalid-feedback').html('错误:' + errorResponse.error);


    }

    //hide loading ico
    let alwaysCallback = function () {
        $('.loading').fadeOut(ANIMATION_SPEED);
    }

    queryData = {
        video_id,
        video_type
    }

    $.getJSON(API_URL, queryData).done(successCallback).fail(failCallback).always(alwaysCallback);


}





/**
 * 
 * @param response {object} 单个物流信息查询结果
 */
function setElement(response) {

    let $listElement = $('.result');

    //empty current content
    $listElement.empty();

    let $element = $('.clone.img-item').clone().removeClass('.clone');

    $element.find("img").attr('src', response.images.shift());

    $listElement.append($element);

    $element.fadeIn(ANIMATION_SPEED);

}


